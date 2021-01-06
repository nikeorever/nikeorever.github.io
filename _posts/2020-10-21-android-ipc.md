---
title: 'IPC'
category: 'Android'
layout: post

categories: post
---

> 这篇文章聊一下Android中IPC。

在Android中可以通过两种方式实现进程间通信，一种是使用 `Messenger`，另一种是使用 **AIDL**，当然这两种方式都是基于 **Binder**，不同之处在于`Messenger`使用 `Handler`进行队列调用，所以不需要在Service端处理多线程(multithreading)，所以AIDL是 **并发IPC(concurrent IPC)**。

#### AIDL

##### 语法规范

