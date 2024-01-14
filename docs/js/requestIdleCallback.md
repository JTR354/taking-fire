# requestIdleCallback

> window.requestIdleCallback() 方法插入一个函数，这个函数将在浏览器空闲时期被调用。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。函数一般会按先进先调用的顺序执行，然而，如果回调函数指定了执行超时时间 timeout，则有可能为了在超时前执行函数而打乱执行顺序。

The window.requestIdleCallback method queues a function to be called during a browser's idle periods. This enables developers to perform background and low priority work on the main event loop without impacting latency-critical events such as animation and input response. Functions are generally called in first-in-first-out order; however, callbacks which have a timeout specified may be called out-of-order if necessary in order to run them before the timeout elapses.

> 你可以在空闲回调函数中调用 requestIdleCallback()，以便在下一次通过事件循环之前调度另一个回调。

You can call requestIdleCallback() within an idle callback function to schedule another callback to take place no sooner than the next pass through the event loop.

> 备注： 强烈建议使用 timeout 选项进行必要的工作，否则可能会在触发回调之前经过几秒钟。

Note: A timeout option is strongly recommended for required work, as otherwise it's possible multiple seconds will elapse before the callback is fired.
