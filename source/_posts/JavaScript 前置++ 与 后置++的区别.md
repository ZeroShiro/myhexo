---
title: JavaScript 前置++ 与 后置++的区别
date: 2023-07-15 15:32
updated: 2023-07-15 15:32
tags:
  - JavaScript
categories:
  - JavaScript
toc: true
excerpt: JavaScript 前置++ 与 后置++的区别
---

## 1. 核心

| 写法 | 术语 | 核心逻辑 | 记忆 |
| :--- | :--- | :--- | :--- |
| **`i++`** | 后置 (Postfix) | 先返回当前值，然后再自增。 | **先用后加**  |
| **`++i`** | 前置 (Prefix) | 先自增，然后返回新的值。 | **先加后用**  |

---

## 2. 基础使用

### 后置 `a++`
```javascript
let a = 10;
console.log(a++); // 输出: 10 (打印的是旧值)
console.log(a);   // 输出: 11 (变量本身确实变了)
```

### 前置 `++a`
```javascript
let b = 10;
console.log(++b); // 输出: 11 (打印的是新值)
console.log(b);   // 输出: 11
```

---

## 3. 进阶使用

JS 表达式是**从左向右**执行的。左边的操作对变量做的修改，右边的代码能立刻感知到。

### 解析 1：`k++ + ++k`
```javascript
let k = 10;
// 执行拆解：
// 1. k++ : 取出旧值 10，内存中 k 变为 11。
// 2. +   : 等待右边计算。
// 3. ++k : 此时 k 已是 11。先自增为 12，取出新值 12。
// 4. 计算: 10 + 12 = 22
let result = k++ + ++k; 
console.log(result); // 22
```

### 解析 2：`++a + a++ + a`
```javascript
let a = 1;
// 执行拆解：
// 1. ++a : a 变 2，取值 2。
// 2. a++ : 取当前值 2，然后 a 变 3。
// 3. a   : 读取当前 a，值为 3。
// 4. 计算: 2 + 2 + 3 = 7
let result = ++a + a++ + a;
console.log(result); // 7
```

---

## 4. 闭包场景 

在闭包中，变量会常驻内存，`++` 的位置决定了返回给调用者的状态。

```javascript
function createCounter() {
  let count = 0; // 闭包变量，常驻内存
  return {
    increment1: () => count++, // 返回旧值，再加
    increment2: () => ++count // 先加，返回新值
  };
}

const a = createCounter();
const b = createCounter();
console.log(a.increment1()); // 0 
console.log(a.increment1()); // 1 
console.log(b.increment2()); // 1 
console.log(b.increment2()); // 2 
```

---

## 最后

1.  **独立行使用**：`i++` 和 `++i` 无区别，推荐 `i++`。
2.  **赋值/打印**：想用旧值写 `i++`，想用新值写 `++i`。
3.  **复杂计算**：**千万别写** `x = a++ + ++a` 这种代码，请拆分成多行，利人利己。
4.  **计数器**：优先用 `count++`，防止字符串拼接事故。