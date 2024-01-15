# requestIdleCallback

> window.requestIdleCallback() 方法插入一个函数，这个函数将在浏览器空闲时期被调用。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。函数一般会按先进先调用的顺序执行，然而，如果回调函数指定了执行超时时间 timeout，则有可能为了在超时前执行函数而打乱执行顺序。

The window.requestIdleCallback method queues a function to be called during a browser's idle periods. This enables developers to perform background and low priority work on the main event loop without impacting latency-critical events such as animation and input response. Functions are generally called in first-in-first-out order; however, callbacks which have a timeout specified may be called out-of-order if necessary in order to run them before the timeout elapses.

> 你可以在空闲回调函数中调用 requestIdleCallback()，以便在下一次通过事件循环之前调度另一个回调。

You can call requestIdleCallback() within an idle callback function to schedule another callback to take place no sooner than the next pass through the event loop.

> 备注： 强烈建议使用 timeout 选项进行必要的工作，否则可能会在触发回调之前经过几秒钟。

Note: A timeout option is strongly recommended for required work, as otherwise it's possible multiple seconds will elapse before the callback is fired.

## Syntax

```js
requestIdleCallback(callback, options?)
```

### Parameters

#### callback

> 一个在事件循环空闲时即将被调用的函数的引用。函数会接收到一个名为 IdleDeadline 的参数，这个参数可以获取当前空闲时间以及回调是否在超时时间前已经执行的状态。

A reference to a function that should be called in near future, when event loop is idle. The callback function is passed an IdleDeadline describing the amount of time available and whether or not the callback has been run because the timeout period expired.

#### options(optional)

> 包括可选的配置参数。具有如下属性：
>
> > - timeout：如果指定了 timeout，并且有一个正值，而回调在 timeout 毫秒过后还没有被调用，那么回调任务将放入事件循环中排队，即使这样做有可能对性能产生负面影响。

Contains optional configuration parameters. Currently only one property is defined:

- timeout:
  If the number of milliseconds represented by this parameter has elapsed and the callback has not already been called, then a task to execute the callback is queued in the event loop(even if doing so risk causing a negative performance impact )
  timeout must be a positive value or it's ignored.
