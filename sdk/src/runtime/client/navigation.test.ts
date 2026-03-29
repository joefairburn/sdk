import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  validateClickEvent,
  initClientNavigation,
  navigate,
} from "./navigation";

// Mocking browser globals
vi.stubGlobal("window", {
  location: { href: "http://localhost/" },
  addEventListener: vi.fn(),
  scrollX: 0,
  scrollY: 0,
  scrollTo: vi.fn(),
  history: {
    scrollRestoration: "auto",
    state: {},
    pushState: vi.fn(),
    replaceState: vi.fn(),
  },
});

vi.stubGlobal("document", {
  addEventListener: vi.fn(),
});

vi.stubGlobal("history", {
  scrollRestoration: "auto",
});

vi.stubGlobal(
  "Headers",
  class {
    map: Record<string, string> = {};
    constructor(init?: any) {
      if (init && init.Location) {
        this.map.location = init.Location;
      }
    }
    get(name: string) {
      return this.map[name.toLowerCase()] || null;
    }
  },
);

describe("clientNavigation", () => {
  let mockEvent: MouseEvent = {
    button: 0,
    metaKey: false,
    altKey: false,
    shiftKey: false,
    ctrlKey: false,
  } as unknown as MouseEvent;
  let mockTarget = {
    closest: () => {
      return {
        getAttribute: () => "/test",
        hasAttribute: () => false,
      };
    },
  } as unknown as HTMLElement;

  it("should return true", () => {
    expect(validateClickEvent(mockEvent, mockTarget)).toBe(true);
  });

  it("should return false if the event is not a left click", () => {
    expect(validateClickEvent({ ...mockEvent, button: 1 }, mockTarget)).toBe(
      false,
    );
  });

  it("none of the modifier keys are pressed", () => {
    expect(
      validateClickEvent({ ...mockEvent, metaKey: true }, mockTarget),
    ).toBe(false);
  });

  it("the target is not an anchor tag", () => {
    expect(
      validateClickEvent(mockEvent, {
        closest: () => undefined,
      } as unknown as HTMLElement),
    ).toBe(false);
  });

  it("should have an href attribute", () => {
    expect(
      validateClickEvent(mockEvent, {
        closest: () => ({ getAttribute: () => undefined }),
      } as unknown as HTMLElement),
    ).toBe(false);
  });

  it("should not include an #hash", () => {
    expect(
      validateClickEvent(mockEvent, {
        closest: () => ({
          getAttribute: () => "/test#hash",
          hasAttribute: () => false,
        }),
      } as unknown as HTMLElement),
    ).toBe(false);
  });

  it("should be a relative link", () => {
    expect(
      validateClickEvent(mockEvent, {
        closest: () => ({
          getAttribute: () => "/test",
          hasAttribute: () => false,
        }),
      } as unknown as HTMLElement),
    ).toBe(true);
  });
});

describe("navigate", () => {
  function createDeferred<T = void>() {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((r) => {
      resolve = r;
    });
    return { promise, resolve };
  }

  beforeEach(() => {
    window.location.href = "http://localhost/";
    vi.clearAllMocks();
    // initClientNavigation sets IS_CLIENT_NAVIGATION = true so navigate()
    // uses client-side navigation instead of full page reload.
    initClientNavigation();
  });

  it("should call pushState only after __rsc_callServer resolves", async () => {
    const callOrder: string[] = [];
    const deferred = createDeferred();

    globalThis.__rsc_callServer = vi.fn(() => {
      callOrder.push("__rsc_callServer");
      return deferred.promise;
    });
    (window.history.pushState as ReturnType<typeof vi.fn>).mockImplementation(
      () => {
        callOrder.push("pushState");
      },
    );

    const navigatePromise = navigate("/page");

    // While the RSC fetch is pending, pushState must not have been called
    await Promise.resolve(); // flush microtasks
    expect(callOrder).toEqual(["__rsc_callServer"]);

    deferred.resolve();
    await navigatePromise;

    expect(callOrder).toEqual(["__rsc_callServer", "pushState"]);
  });

  it("should pass target URL to __rsc_callServer, not current location", async () => {
    globalThis.__rsc_callServer = vi.fn(() => Promise.resolve());

    await navigate("/new-page");

    expect(globalThis.__rsc_callServer).toHaveBeenCalledWith(
      null,
      null,
      "navigation",
      undefined,
      "http://localhost/new-page",
    );
  });

  it("should call replaceState for navigation only after __rsc_callServer resolves when history is 'replace'", async () => {
    const deferred = createDeferred();
    const replaceStateCalls: { path: string }[] = [];

    globalThis.__rsc_callServer = vi.fn(() => deferred.promise);
    (
      window.history.replaceState as ReturnType<typeof vi.fn>
    ).mockImplementation((state: any) => {
      replaceStateCalls.push(state);
    });

    const navigatePromise = navigate("/page", { history: "replace" });

    // While the RSC fetch is pending, only saveScrollPosition's replaceState
    // should have fired (it saves scroll on the current entry, no `path` key).
    // The navigation replaceState (which carries `path`) must not have fired yet.
    await Promise.resolve();
    expect(
      replaceStateCalls.some((s) => s.path === "/page"),
    ).toBe(false);

    deferred.resolve();
    await navigatePromise;

    expect(
      replaceStateCalls.some((s) => s.path === "/page"),
    ).toBe(true);
  });
});

describe("initClientNavigation", () => {
  beforeEach(() => {
    window.location.href = "http://localhost/";
    vi.clearAllMocks();
  });

  it("handleResponse should follow redirects", () => {
    const { handleResponse } = initClientNavigation();

    const mockResponse = {
      status: 302,
      headers: new Headers({ Location: "/new-page" }),
      ok: false,
    } as unknown as Response;

    const result = handleResponse(mockResponse);

    expect(result).toBe(false);
    expect(window.location.href).toBe("/new-page");
  });

  it("handleResponse should reload on error", () => {
    const { handleResponse } = initClientNavigation();

    const mockResponse = {
      status: 500,
      ok: false,
    } as unknown as Response;

    const result = handleResponse(mockResponse);

    expect(result).toBe(false);
    expect(window.location.href).toBe("http://localhost/");
  });
});
