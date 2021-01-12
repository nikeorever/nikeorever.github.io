---
title: 'IPC'
category: 'Android'
layout: post

categories: post
---

> 这篇文章聊一下Android中IPC。

在Android中可以通过两种方式实现进程间通信，一种是使用 `Messenger`，另一种是使用 **AIDL**，当然这两种方式都是基于 **Binder**，不同之处在于`Messenger`使用 `Handler`进行队列调用，所以不需要在Service端处理多线程(multithreading)，所以AIDL是 **并发IPC(concurrent IPC)**。

#### AIDL

 - 支持AIDL文件中所有的代码注释（除了 `import` 或 `package` 语句之前的注释）
 
 ```
 // AIDLService.aidl
package cn.nikeo.app;

// The comment before import statement.
import java.lang.String;
/**
 *  The comment before AIDLService.
 */
interface AIDLService {
    /**
     * Demonstrates some basic types that you can use as parameters
     * and return values in AIDL.
     */
    void basicTypes(int anInt, long aLong, boolean aBoolean, float aFloat,
            double aDouble, String aString);

    /**
     * The comment before constants.
     */
    const int TYPE = 10;
}
 ```

Generated

```java
/*
 * This file is auto-generated.  DO NOT MODIFY.
 */
package cn.nikeo.app;
/**
 *  The comment before AIDLService.
 */
public interface AIDLService extends android.os.IInterface
{
  
  ...

  /**
       * The comment before constants.
       */
  public static final int TYPE = 10;
  /**
       * Demonstrates some basic types that you can use as parameters
       * and return values in AIDL.
       */
  public void basicTypes(int anInt, long aLong, boolean aBoolean, float aFloat, double aDouble, java.lang.String aString) throws android.os.RemoteException;
}

```

- 对于一些自定义的AIDL-generated接口类型或自定义的parcelable类型，如果要在其他AIDL文件中引用它，即使是同包下，也需要主动 `import` 该类型。

```
// Runnable.aidl
package cn.nikeo.app;

interface Runnable {
    void run();
}
```

```
// Rect.aidl
package cn.nikeo.app;

parcelable Rect {
    int left;
    int top;
    int right;
    int bottom;
}
```

```
// AIDLService.aidl
package cn.nikeo.app;

import cn.nikeo.app.Runnable;
import cn.nikeo.app.Rect;

interface AIDLService {
    void stringType(String str);
    void runnableType(Runnable runnable);
    void rectType(inout Rect rect);
}
```



##### 支持的数据类型

 - 除 `short` 之外的所有基本数据类型（`boolean`, `char`, `byte`, `int`, `long`, `float`, `double`）。

   方向标记：必须是 `in`，可以省略。

 - `java.lang.String`。
  
   方向标记：必须是 `in`，可以省略。

- `java.lang.CharSequence`。
  
   方向标记：必须是 `in`，可以省略。

- AIDL-generated interfaces。

   方向标记：必须是 `in`，可以省略。

- `android.os.IBinder`。
  
   方向标记：必须是 `in`，可以省略。

- `android.os.Parcelable`的实现类（如 `android.os.Bundle`）。
  
   方向标记：必须是 `in`, `out` 或 `inout`，不可以省略。  

- `java.util.List`。支持指定泛型参数类型（如`List<String>`），接收端实际接受到的具体类型是 `java.util.ArrayList`。
  
   方向标记：必须是 `in`, `out` 或 `inout`，不可以省略。 

- `java.util.Map`。不支持指定泛型参数类型（如`Map<String, String>`），接收端实际接受到的具体类型是 `java.util.HashMap`,推荐使用 `android.os.Bundle`。
  
   方向标记：必须是 `in`, `out` 或 `inout`，不可以省略。 

- 数组类型（如 `int[]`, `String[]`）。
  
   方向标记：必须是 `in`, `out` 或 `inout`，不可以省略。        

##### AIDL 接口方法

 - 方法可以携带0个或多个方法参数，返回 `void` 或一个值。
 - 可以定义 `java.lang.String` 或 `int` 类型的常量。

 ```
    const int VERSION = 1;
    const String TAG = "TAG";
 ```

 - Nullable的参数或返回值可以注解 `@nullable`。

 ```
    @nullable
    String nullableType(@nullable String name);
 ```