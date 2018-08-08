---
title: Big Counting
date: "2018-04-29T17:40:32.169Z"
layout: post
draft: false
path: "/posts/big-counting/"
category: "Math"
description: "Implement exponential and beyond using only ++, and a single for loop."
tags:
  - "Math"
---

Functional composition is pretty in right now. I learn by doing and explaining so lets do some of that.

The challenge
##### Implement add, multiply, exp, and beyond using no tools other than function composition, ++/--, and a single for loop 


- No arrays/data structures
- Single iteration call(for/while)
- No +, *, or ^
- Positive integers only (don't need to worry about 3.14, -2, i)

Why am I doing this to myself? Is this even possible? 

I feel like it should be. 

++ only adds one, but I have a sense that addition, multiplication, and the rest can all be described as just a whole lot of +1s. 

And if we use the for loop in the right way we should be able to reuse it somehow to make it work.

Okay let's have at it. 

---

### Add
This one's easy because one for loop is all we need. 

```js
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

```js
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
```js
(f, Int) -> ... 
```
Hold on here! Don't those fancy function people prefer passing these one at a time? Let's do that instead.
```js
f -> Int -> ... 
```
What about the output? Well, ultimately, are going to be dealing with integers, so we want a number to come out of this. We might also want a number to start with as input(another Int). So our new types are:
```
f -> Int -> Int -> Int
``` 
The implementation is pretty simple:
```js
export let applyItNTimes = (it) => (n) => (val) => {
    for(let i=0; i < n; i++){
        val = it(val)
    }
    return val
};
```

Okay so how would we use this to do addition? Well, the first input we need is a function. Let's make our successor(increment) function:
```js
const inc = (a) => a++
```
next we make a function that will accept a number of times for our repeating successor function to be called, and then pass that on to the curry chain in applyItNTimes
```js
const repeatInc = applyItNTimes(inc);
```
Okay, let's go for add now. We want to start with one number(`B`), and then repeat our inc call `A` times. So `A` needs to be next in the curry chain, and then we start it off with `B`.
```js
const add = (a, b) => repeatInc(a)(b)
expect(add(3,42)).toBe(45)
```
Nice! Okay on to multiplication. Before we tackle this, let's unpack multiplication the same way as we did for addition. If addition was repeatedly "inc" `B` times, starting from A, is there a way we can compose multiplication from repeated application of another function? Yes! For multiplication, we want to repeatedly "add A" `B` times, starting from 0. 

First step: Make a function to "add A". We'll accept `A` as an input and return a function that will add A: `Int -> Int -> Int`. We can make this by reusing our repeatInc function above by repeating `A` increments.
```js
const addA = (a) => repeatInc(a)
```

Great! Now we can make repeatAddOfA:

```js
const repeatAddOfA = (a) => applyItNTimes(addA(a))
```

Doing this `B` times starting at zero means we need to pass in those arguments:
```js
const curriedMultiply = (a) => (b) => repeatAddOfA(a)(b)(0);
const multiply = (a,b) => curriedMultiply(a)(b);
expect(multiply(3,5)).toBe(15);
```

You may notice that we are often working with functions that only accept one argument, and often return functions. These are functional programming patterns known as currying. Doing things this way makes it easier for us to compose these functions together. We can partially apply arguments and then compose the partially applied function(addA) in order to reach our goal. 

To accomplish exponentiation, we need a function to repeatedly multiply by a number(A). The first step is then to get a function that multiplies a number. For example mul3 would multiply 3 to it's argument. To be generic, mulA would multiply by `A`. We will then apply this function `B` times to get our answer. Very similar pattern to how we jumped to multiplication from addition. The only difference here is that we will have to start from 1 rather than 0. Why are we starting from 1 instead of 0? It seems like the approach that we have taken has resulted in us brushing up against another functional programming feature - monoids. 

Monoids are binary operations like addition and multiplication that take in two things of the same type and return a third thing of that same type. They have a couple additional properties, and one of them is an 'identity'. The identity is a special value which, when used as one of the two inputs, means that the other input is the same as the output. As an example, when adding, adding by 0 always means that whatever you added 0 to is unchanged. So 0 is an identity.
```js
const addA = (a) => repeatInc(a);
cont addZero = addA(0);
expect(addZero(5)(0)).toBe(5);
```
For multiplication, zero doesn't work, but 1 does! There is another property for these operations that helps them make a monoid: associativity. [If you haven't seen my previous article on associativity, give it a look!](http://www.georgepatrickmontgomery.com/posts/2017-01-24-Associativity/) Associativity means that if we compose the operation with itself, then order doesn't matter. For example, for addition:

```js
expect(add(3, add(4, 5))).toBe(add(add(3, 4), 5));
```
Multiplication has the same property. Let's move on to exponentiation and see if these properties still hold. 

```js
const mulA = (a) => (b) => mul(a,b);
const repeatMulOfA = (a) => applyItNTimes(mulA(a));
const curriedExp = (a) => (b) => repeatMulOfA(a)(b);
const curriedExpToIdentity = (a) => (b) => curriedExp(a)(b)(1);
const exp = (a,b) => curriedExpToIdentity(a)(b);
```
For starters, do we have an identity still? You bet we do! Raising something to the power of 1 leaves it unchanged. What about associativity? 
```js
expect(exp(2, exp(3, 4))).toBe(exp(exp(2, 3), 4)); // throws!!!
```
Looks like the we no longer have a monoid because we got different answers depending on the order of the operation. Any guess for which of the two orders resulted in a bigger number? Any thoughts on by how much? The second one there has 3 digits. That's pretty big. But the first has 25 digits. Not close. This means that grouping has started to matter. `exp(3,4)` is already a very large number, where `exp(2,3)` is 8. In some sense, the first operation was wasted on a 2 and a 3. But the problem is deeper than that. Consider the following operation:
```js
exp(exp(3, 4), exp(2, 3))
```
We have an extra 3 and an extra call to exp in this input. But even though the inputs might make it seem like we will get a larger result, this total is over a billion times smaller than the simple `exp(2, exp(3, 4))`. Our intuition doesn't work well for these kinds of operations. If you want big numbers, you want a chain that puts the largest numbers far off to the right. This results in more operations, which seems to pay off more than having larger inputs.

So what might come after exponentiation? This operation isn't usually taught in school: tetration. Tetration grows much faster than exponentiation. Tetration(3,4) would be 3^(3^(3^3)) And remember the order matters here. This is much larger than ((3^3)^3)^3. how much larger? ((3^3)^3)^3 has twelve digits. 3^(3^(3^3)) has 3.6 trillion digits. Let's compose it:
```js
const expA = (a) => (b) => exp(a,b);
const repeatExpOfA = (a) => applyItNTimes(expA(a));
const curriedTet = (a) => (b) => repeatExpOfA(a)(b);
const curriedTetToIdentity = (a) => (b) => curriedTet(a)(b)(1);
const tet = (a,b) => curriedTetToIdentity(a)(b);
```

 Counting by ones, even Tetration(3,3) would cause a stack overflow. But, get this - despite what we just learned with exponentiation, where having larger numbers at the end resulted in huge totals, we can do actually compute Tet(2,4). Odd...
 ```js
expect(funs.tetA(4)(2)).toBe(256);
```

Let's keep going just for fun. Next is is pentation - if you thought the jump from exponentials to tetration was big, just wait for this. Imagine how quickly the numbers grew when we started stacking up the exponential chain. Even just 4 threes stacked up gave us a number with 3.6 trillion digits. What about if that was pentation instead? Well, imagine a chain not just stacked 4 threes high, but with 7 trillion threes stacked on top of each other. Then take that number that you get from that super high stack, and then make a new stack with that many threes. That's how big Pent(3,4) is. Once again, pretty amazing that we can actually compute Pent(2,3) without a stack overflow.
```js
const tetA = (a) => (b) => tet(a,b);
const repeatTetOfA = (a) => applyItNTimes(tetA(a));
const curriedPen = (a) => (b) => repeatTetOfA(a)(b);
const curriedPenToIdentity = (a) => (b) => curriedPen(a)(b)(1);
const pen = (a,b) => curriedPenToIdentity(a)(b);
expect(funs.pen(2, 3)).toBe(65536);
```

Okay we can't do Hex(2,3) anymore without an overflow, but that's okay given how quickly these things are growing. Let's try a more modest Hex(2,2) this time. That still ought to be be huge given how crazy these growing functions are getting, right? Any guesses on how big that will be? Thoughts? Go ahead take a guess. Did you guess four?. Well that's what it is. Not sure why? Thing about why 2 + 2 is the same as 2 * 2 and 2 ^ 2. This is not a coincidence. In fact any of the preceding or possibly following operation of 2 and 2 yield 4. It is like some crazy weird point of stability as everything else runs off to infinity. 

Okay so what about if we wanted to abstract even further? 

The generalized operation is known as the *hyper* operator. The hyper operator, unlike binary operators like + or *, who take only an `a` and a `b`, takes a third number as input(`n`), which does not determine the initial values to be input into the operation, but rather determines which operation to use. Where to consider the 'starting' operation of the hyper operator(at n=0) is a bit arbitrary, but for now let's consider n=0 to be ++, and n=1 to be +, and n=2 to be *, and so on and so forth as we showed above. 

## Hyper  
If we look back on how we crafted each operation by using the previous operation, we can see a clearly repeated pattern. We take a binary operation, build a partially applied version, pass that partially applied operation into our abstracted applyItNTimes repeater, then wrap our newly created operation in a curry, an identity, and finally a binary version which can be used as the next input. Now, if we want to repeat this composition process `n` times, we will have to find some way to once again make use of our repeater.

"Hold on, I thought the repeater used numbers as inputs".

Is mulA(a) an integer here? 
```
const repeatMulOfA = (a) => applyItNTimes(mulA(a));
```
No it is not. It is a function which will multiply its first input to it's second. Okay, so we can pass functions through. How can we make use of this? Well, if we want to create whatever binary operation is needed, we need to be working with binary operations, using each one to help build the next. This means that if we want to applyItNTimes, then 'it' in this context is the process of taking one binary operation and returning another one which is one tick larger. So 'it' should take a binary function `B` and return a binary function `B'`:

Warning: I'm about to get very loose with my type notation here, and I hope I don't offend any real math people. I'm sorry. I'm also sorry for the variable names. It's almost easier just to offend everyone at this point...

```js
const binaryCurry = (op) => (a) => (b) => op(a, b);

// it(aka nextOperation) :: B => B
const nextOperation = (binary) => {
    const opA = binaryCurry(binary);
    const repeatOpOfA = (a) => applyItNTimes(opA(a));
    const repeatOpOfAByBTimes = (a) => (b) => repeatOpOfA(a)(b);
    const repeatOpOfAByBTimesToIdentity = 
        (a) => (b) => repeatOpOfAByBTimes(a)(b)(1);
    return (a, b) => repeatOpOfAByBTimesToIdentity(a)(b);
}
```

One problem we have here is that the identity is not 1 for addition. We can return early for n=0 and n=1 in the hyper implementation:
```js
import {add, mul} from "./building-operations";
import {applyItNTimes, suc} from "./axiomatic-operations";

let hyper = (n, a, b) => {
    if (n === 0) {
        return suc(a)(b)
    }
    if (n === 1) {
        return add(a, b)
    }
    n--;
    n--;
    return hyperNFromMul(n, a, b);
};
```

Then, working from multiplication as a starting point, we will use the next operation generator, our `n` input, and multiplication as our starting binary function to give us the final operation. Then finally we invoke the operation using our `A` and `B` inputs.

```js
let hyperNFromMul = (n, a, b) => {
    let hyper = applyItNTimes(nextOperation);
    const hyperN = hyper(n);
    const hyperNFromMul = hyperN(mul);
    return hyperNFromMul(a, b)
};
```

And that's all there is to it! 

I shared all the code here: https://github.com/Adverbly/functional-playground
