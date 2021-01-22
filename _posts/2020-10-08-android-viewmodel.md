---
title: 'ViewModel'
category: 'Android'
layout: post

categories: post
---

#### androidx.activity.ComponentActivity

设计架构：

```
+-----------------------------------------------------------------------------------------------------+
|androidx.activity.ComponentActivity(or Derived Class)                                                |
|                                                          onResume(new instance)                     |
|                                                              ^                                      |
|                                                              |                                      |
|              getViewModelStore()                         onStart(new instance)->getViewModelStore() |
|                     ^                                        ^                                      |
|                     |                                        |                                      |
|    +-------------------------------------------+         onCreate(new instance)->getViewModelStore()|    
|    |    androidx.lifecycle.ViewModelStore      |             ^                                      |
|    | (Single instance & Lazy initialization)   |             |                                      |
|    |     --------------------------------      |         onDestroy                                  |
|    |    |androidx.lifecycle.ViewModel - 1|     |             ^                                      |
|    |    |androidx.lifecycle.ViewModel - 2|     |             |                                      |
|    |    |androidx.lifecycle.ViewModel - 3|     |             |                                      |
|    |    |...                             |     |------>onRetainNonConfigurationInstance()           |   
|    |    |androidx.lifecycle.ViewModel - N|     |             ^                                      |
|    |     --------------------------------      |             |                                      |
|    |                                           |             |                                      |
|    |  clear: 1. Call clear() of each ViewModel.|           onStop                                   |
|    |   ^     2. Clear all viewModels           |             ^                                      |
|    +---|---------------------------------------+             |                                      |
|        |                                                     |                                      |
|        |                                                  onPause(due to configuration changed)     |
|        |                                                                                            |
|     onDestroy <---onStop <--- onPause(activity is done and should be closed.)                       |
+-----------------------------------------------------------------------------------------------------+
```
上面这张架构图描述了`androidx.activity.ComponentActivity`, `androidx.lifecycle.ViewModelStore` 和 `androidx.lifecycle.ViewModel`之间的关系：每个`androidx.activity.ComponentActivity`的派生Activity都会持有**1个**`androidx.lifecycle.ViewModelStore`，只不过`androidx.lifecycle.ViewModelStore`直到`getViewModelStore()`调用时才会惰性创建1次（需要注意的是，创建这个`androidx.lifecycle.ViewModelStore`的前提有两个：当前Activity对象持有的`mViewModelStore`为`null`；如果当前Activity对象是由于配置改变（如旋转）重新创建的，而`getViewModelStore()`并没有在*onCreate*或*onStart*时调用，则获取不到上次存储的`androidx.lifecycle.ViewModelStore`实例），这个`androidx.lifecycle.ViewModelStore`中会存储所有在这个派生Activity里创建的`androidx.lifecycle.ViewModel`。当当前Activity正常需要销毁的时候，会调用`androidx.lifecycle.ViewModelStore`的`clear`方法：先去调用所有的`androidx.lifecycle.ViewModel`的`clear`方法以通知当前`ViewModelStoreOwner`（`androidx.activity.ComponentActivity`/`androidx.fragment.app.Fragment`）需要销毁了，然后在清除调所有的`androidx.lifecycle.ViewModel`。
```java
//androidx.activity.ComponentActivity.java

package androidx.activity;

public class ComponentActivity extends androidx.core.app.ComponentActivity implements
        LifecycleOwner,
        ViewModelStoreOwner,
        HasDefaultViewModelProviderFactory,
        SavedStateRegistryOwner,
        OnBackPressedDispatcherOwner {

    static final class NonConfigurationInstances {
        Object custom;
        ViewModelStore viewModelStore;
    }

    // Lazily recreated from NonConfigurationInstances by getViewModelStore()
    private ViewModelStore mViewModelStore;

    /**
     * Default constructor for ComponentActivity. All Activities must have a default constructor
     * for API 27 and lower devices or when using the default
     * {@link android.app.AppComponentFactory}.
     */
    public ComponentActivity() {
        getLifecycle().addObserver(new LifecycleEventObserver() {
            @Override
            public void onStateChanged(@NonNull LifecycleOwner source,
                    @NonNull Lifecycle.Event event) {
                if (event == Lifecycle.Event.ON_DESTROY) {
                    if (!isChangingConfigurations()) {
                        getViewModelStore().clear();
                    }
                }
            }
        });
    }

    /**
     * Retain all appropriate non-config state.  You can NOT
     * override this yourself!  Use a {@link androidx.lifecycle.ViewModel} if you want to
     * retain your own non config state.
     */
    @Override
    @Nullable
    public final Object onRetainNonConfigurationInstance() {
        Object custom = onRetainCustomNonConfigurationInstance();

        ViewModelStore viewModelStore = mViewModelStore;
        if (viewModelStore == null) {
            // No one called getViewModelStore(), so see if there was an existing
            // ViewModelStore from our last NonConfigurationInstance
            NonConfigurationInstances nc =
                    (NonConfigurationInstances) getLastNonConfigurationInstance();
            if (nc != null) {
                viewModelStore = nc.viewModelStore;
            }
        }

        if (viewModelStore == null && custom == null) {
            return null;
        }

        NonConfigurationInstances nci = new NonConfigurationInstances();
        nci.custom = custom;
        nci.viewModelStore = viewModelStore;
        return nci;
    }

    /**
     * Returns the {@link ViewModelStore} associated with this activity
     * <p>
     * Overriding this method is no longer supported and this method will be made
     * <code>final</code> in a future version of ComponentActivity.
     *
     * @return a {@code ViewModelStore}
     * @throws IllegalStateException if called before the Activity is attached to the Application
     * instance i.e., before onCreate()
     */
    @NonNull
    @Override
    public ViewModelStore getViewModelStore() {
        if (getApplication() == null) {
            throw new IllegalStateException("Your activity is not yet attached to the "
                    + "Application instance. You can't request ViewModel before onCreate call.");
        }
        if (mViewModelStore == null) {
            NonConfigurationInstances nc =
                    (NonConfigurationInstances) getLastNonConfigurationInstance();
            if (nc != null) {
                // Restore the ViewModelStore from NonConfigurationInstances
                mViewModelStore = nc.viewModelStore;
            }
            if (mViewModelStore == null) {
                mViewModelStore = new ViewModelStore();
            }
        }
        return mViewModelStore;
    }
}
```

综上所述，下面列出几个的关键点：

 - 当你的Activity是`androidx.activity.ComponentActivity`的派生类，如果需要存储一些将由配置改变（比如旋转）而丢失的昂贵数据，推荐使用   `androidx.lifecycle.ViewModel`。这是因为`androidx.activity.ComponentActivity`重写了`onRetainNonConfigurationInstance()`这个方法并添加了`final`修饰符，所以不允许其派生类继续重写。当然你也可以使用`onRetainCustomNonConfigurationInstance`和`getLastCustomNonConfigurationInstance`这两个方法实现，但这两个方法都已经废弃，所以不推荐使用。
 - `getViewModelStore()`不能在`onCreate()`生命周期之前调用。
 - 如果当前Activity实例是由于配置变更（比如旋转）重新创建的，`getViewModelStore()`的调用除了不能在`onCreate()`生命周期之前调用，还不能在`onStart`之后调用，即只能在`onCreate`和`onStart`这两个生命周期中调用。
 - 如果当前Activity实例由于配置变更（比如旋转）执行销毁流程，当销毁的时候，不移除所有存储的`androidx.lifecycle.ViewModel`。
#### Fragment
