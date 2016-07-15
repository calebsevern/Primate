# Primate
Surveys without the monkey business.

![Primate survey view](https://severn.me/css/img/primate.png)

---

###Getting Started

1. Create the Primate DB: 
  
  ```sql
  CREATE DATABASE primate_poll;
  ```
2. Add appropriate MySQL username/password to [config.js](https://github.com/calebsevern/Primate/blob/master/app/config.js)
3. Start the server

  ```javascript
  npm install
  npm start
  // Visible at localhost:3333 by default
  ```

---

###Authentication
- User accounts are not required. Authentication is handled with a static [auth secret](https://github.com/calebsevern/Primate/blob/master/app/config.js#L20) which can be set at runtime.
- Alternatively, the default password **`turtleturtle`** can be used.
