---
title: Implementing Exponentials From The Ground Up
date: "2018-04-29T17:40:32.169Z"
layout: post
draft: false
path: "/posts/function-factory/"
category: "Math"
description: "Implement exponential and beyond using only ++, and a single for loop."
tags:
  - "Math"
---

Functional composition is pretty in right now. I learn by doing and explaining so lets do some of that.

The challenge
```
Implement add, multiply, exp, and beyond using no tools other than function composition, ++, and a single for loop 
```

- No arrays 
- No while
- No +, *, or ^.
- Positive integers only (no 3.14 or -2 or i to worry about)

Why am I doing this to myself? Is this even possible? 

I feel like it should be. 

++ only adds one, but I have a sense that addition, multiplication, and the rest can all be described as just a whole lot of +1s. 

And if we use the for loop in the right way we should be able to reuse it somehow to make it work.

Okay let's have at it. 

---

### Add
This one's easy because one for loop is all we need. 

```
const add = (a,b) => {
    let sum = a;
    for (let i = 0; i < b; i++){
        sum++
    }
    return sum
};
```

### Multiply
Well shit. We already used up our for loop. If we had two loops, we could do something like:

```
const multiply = (a,b) => {
    let sum = 0;
    for (let i = 0; i < a; i++){
        for (let i = 0; i < b; i++){
            sum++
        }
    }
    return sum
};
```
So we'll need some way to nest/reuse a loop.

## Abstracting Repetition 
Repeating something means doing the same thing over and over again. This means we'll need a way to specify what we want to do, as well as the number of times we want to do it(an Int). So our input needs to start with something like:
```
(f, Int) -> ... 
```
Hold on here! Don't those fancy function people prefer passing these one at a time? Let's do that instead.
```$xslt
f -> Int -> ... 
```
What about the output? Well, ultimately, are going to be dealing with integers, so we want a number to come out of this. We might also want a number to start with as input(another Int). So our new types are:
```
f -> Int -> Int -> Int
``` 
The implementation is pretty simple:
```$xslt
export let applyItNTimes = (it) => (n) => (val) => {
    for(let i=0; i < n; i++){
        val = it(val)
    }
    return val
};
```

Okay so how would we use this to do addition? Well, the first input we need is a function. Let's make our successor(increment) function:
```$xslt
const inc = (a) => a++
```
next we make a function that will accept a number of times for our repeating successor function to be called, and then pass that on to the curry chain in applyItNTimes
```$xslt
const repeatInc = applyItNTimes(inc);
```
Okay, let's go for add now. We want to start with one number(b), and then repeat our inc call a times. So a needs to be next in the curry chain, and then we start it off with b.
```$xslt
const add = (a, b) => repeatInc(a)(b)
expect(add(3,42)).toBe(45)
```
Nice! Okay on to multiplication. Before we tackle this, let's unpack multiplication the same way as we did for addition. If addition was repeatedly "inc" B times, starting from A, is there a way we can compose multiplication from repeated application of another function? Yes! For multiplication, we want to repeatedly "add A" B times, starting from 0. 

First step: Make a function to "add A". We'll accept A as an input and return a function that will add A: Int -> Int -> Int. We can make this by reusing our repeatInc function above by repeating A increments.
```$xslt
const addA = (a) => repeatInc(a)
```

Great! Now we can make repeatAddOfA:

```angularjs
const repeatAddOfA = (a) => applyItNTimes(addA(a))
```

Doing this B times starting at zero means we need to pass in those arguments:
```angularjs
const curriedMultiply = (a) => (b) => repeatAddOfA(a)(b)(0);
const multiply = (a,b) => curriedMultiply(a)(b);
expect(multiply(3,5)).toBe(15);
```

You may notice that we are often working with functions that only accept one argument, and often return functions. This is a pattern in functional programming known as currying. Doing things this way makes it easier for us to compose these functions together. We can partially apply arguments and then compose the partially applied function(addA) in order to reach our goal. 

To accomplish exponentiation, we need a function to repeatedly multiply by a number(A). The first step is then to get a function that multiplies a number. For example mul3 would multiply 3 to it's argument. To be generic, mulA would multiply by A. We will then apply this function B times to get our answer. Very similar pattern to how we jumped to multiplication from addition. The only difference here is that we will have to start from 1 rather than 0. It seems like the approach that we have taken has resulted in us brushing up against another functional programming feature - monoids. 

Monoids are binary operations like addition and multiplication that take in two things of the same type and return a third thing of that same type. They have a couple additional properties, and one of them is an 'identity'. Our starting point has to be the identity so that we can keep our result from changing. You can also think of identities as being the argument that you can pass to the curried version of our operation that will allow whatever the second number that gets applied to be the same as the final result. For example:
```angularjs
const addA = (a) => repeatInc(a);
cont addZero = addA(0);
expect(addZero(5)(0)).toBe(5);
```
For multiplication, zero doesn't work, but 1 does! There is another property for these operations that helps them make a monoid: associativity. [If you haven't seen my previous article on associativity, give it a look!](http://www.georgepatrickmontgomery.com/posts/2017-01-24-Associativity/) Associativity means that if we compose the operation with itself, then order doesn't matter. For example, for addition:

```angularjs
expect(add(3, add(4, 5))).toBe(add(add(3, 4), 5));
```
Multiplication has the same property. Let's move on to exponentiation and see if these properties still hold. 

```angularjs
const mulA = (a) => (b) => mul(a,b);
const repeatMulOfA = (a) => applyItNTimes(mulA(a));
const curriedExp = (a) => (b) => repeatMulOfA(a)(b);
const curriedExpToIdentity = (a) => (b) => curriedExp(a)(b)(1);
const exp = (a,b) => curriedExpToIdentity(a)(b);
```
For starters, do we have an identity still? You bet we do! Anything to the 1 is still 1. What about associativity? 
```angularjs
expect(exp(2, exp(3, 4))).toBe(exp(exp(2, 3), 4)); // throws!!!
```
Any bets on what was bigger? Any thoughts on by how much? The second one there has 3 digits. That's pretty but. But the first has 25 digits. Not close. There must be a fundamental difference between what we are doing with A and what we are doing with B. Let's see if we can unpack why there is such a large difference. A is what I like to call the operator. It is the number that goes into crafting our operation. Operating by A is what we are doing. B is just how many times we operate by A. It looks like when the operations get abstracted enough, it is how many times you are operating that matters more than what you are using in your operations. 

So what might come after exponentiation? This operation isn't usually taught in school: tetration. Tetration grows much faster than exponentiation. Tetration(3,4) would be 3^(3^(3^3)) And remember the order matters here. This is much larger than ((3^3)^3)^3. how much larger? ((3^3)^3)^3 has twelve digits. 3^(3^(3^3)) has 3.6 trillion digits. Counting by ones, even Tetration(3,3) would cause a stack overflow. But we can do Tet(2,4).
```angularjs
const expA = (a) => (b) => exp(a,b);
const repeatExpOfA = (a) => applyItNTimes(expA(a));
const curriedTet = (a) => (b) => repeatExpOfA(a)(b);
const curriedTetToIdentity = (a) => (b) => curriedTet(a)(b)(1);
const tet = (a,b) => curriedTetToIdentity(a)(b);
expect(funs.tetA(4)(2)).toBe(256);
```

Let's keep going just for fun. Next is is pentation - if you thought the jump from exponentials to tetration was big, just wait for this. Imagine how quickly the numbers grew when we started stacking up the exponential chain. Even just 4 threes stacked up gave us a number with 3.6 trillion digits. What about if that was pentation instead? Well, imagine a chain not just stacked 4 threes high, but with 7 trillion threes stacked on top of each other. Then take that number that you get from that super high stack, and then make a new stack with that many threes. That's how big Pent(3,4) is. Once again, pretty amazing that we can actually compute Pent(2,3) without a stack overflow.
```angularjs
const tetA = (a) => (b) => tet(a,b);
const repeatTetOfA = (a) => applyItNTimes(tetA(a));
const curriedPen = (a) => (b) => repeatTetOfA(a)(b);
const curriedPenToIdentity = (a) => (b) => curriedPen(a)(b)(1);
const pen = (a,b) => curriedPenToIdentity(a)(b);
expect(funs.pen(2, 3)).toBe(65536);
```

Okay we can't do Hex(2,3) anymore without an overflow, but that's okay given how quickly these things are growing. Let's try a more modest Hex(2,2) this time. That still ought to be be huge given how crazy these growing functions are getting, right? Any guesses on how big that will be? Thoughts? Go ahead take a guess. Did you guess four?. Well that's what it is. Not sure why? Thing about why 2 + 2 is the same as 2 * 2 and 2 ^ 2. This is not a coincidence. In fact any of the preceding or possibly following operation of 2 and 2 yield 4. It is like some crazy weird point of stability as everything else runs off to infinity. 

Okay so what about if we wanted to abstract even futher? The generalized operation 

