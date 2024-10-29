# Battleships (Battleships)

This is a portfolio project impletmenting the classic 2-player guessing game. It is played on a shared screen.

This is the first experimental project using full Composition setup script and Pinia for state management. 

It took me some time to get use to the Composition-style syntax but the base logic is pretty much the same as Options.

One major benefit of setup-and-Pinia combo (that I felt) is that they both share the same style of syntax. Pinia store is easier to read and to use/call in components. For an (over simplified) example, with Vuex, when calling a state in component, it looks something like this 
```
const value = this.$store.state.[module].[state]
```
With Pinia, it may looks like this:
```
const store = useExampleStore();
const value = store.[state];

// or to make it reactive

const reactiveValue = toRef(store, 'state');
```

Inside the store, Pinia also gets the benefit of Composition API when [dealing with multiple logical concerns](https://vuejs.org/guide/extras/composition-api-faq.html#more-flexible-code-organization). That was perfect for this little project, especially given the scale of it. For an example, in the Battleships store, the top part is object with data stored in objects; followed by code related to initialising the game; ended with constants for manual placement, and game play. It makes the store easier to maintain.

If the project ever scales up, Pinia's modular nature would definitly be helpful.

Of course Pinia may not the best-of-all-times, but working with all the tools I used for this project, it felt quite good.

Putting functions in a helper.js file also helped a lot. It increases reusability and keeps components in a reasonable size.

There is one thing I am still working on: separate components at the start of it. If you look into the commit messages, it's not difficult to find that I start writing an app into one big component and then take it apart in later stage of development. In itself is not a problem but it is not a good practice. I really felt it when I was trying to break my game prototype into few components.

## How does the game play?

Players first choose their fleet formation, then game starts automatically.

While choosing formation, ship placement and the buffer tile around the ship will be colored in red and blue. Once game starts, active player will see their own formation shown as "Your Remaning Fleet" colored in green. Any attacks will be shown in red(successful hit) and grey(missed attack).

A modal will pop up when game ends. Quick start with button.

## Features
1. 2 modes of formation placement: Auto and Manual
2. Auto end turn will give 1.5 second of delay after lauching attack
3. Player can choose their own end turn method, and can change at any time in their turn
4. Clear indication of formation placement and damage situation
5. Tooltip shows ship length when hovering over buttons that represents fleet

## How to run the project
```
$ npm install
$ quasar dev
```