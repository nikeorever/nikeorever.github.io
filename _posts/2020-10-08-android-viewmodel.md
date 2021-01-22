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
|                     ^                                         ^                                     |
|                     |                                         |                                     |
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

#### Fragment
