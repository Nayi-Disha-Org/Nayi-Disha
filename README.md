# Nayi-Disha
fardeengit checkout -b feature-name
```text
                                                        [ Nayi-Disha ]
                                                              |
          +--------------------------------+------------------+------------------+--------------------------------+
          |                                |                                     |                                |
   [ root files ]                     [ hardware ]                          [ backend ]                      [ frontend ]
          |                                |                                     |                                |
       README.md                      [ esp32_band ]                             |                                |
       package.json                        |                               +-----+-----+                    +-----+-----+
       package-lock.json                config.h                           |           |                    |           |
       tree.txt                       esp32_band.ino                  [ config ] [ controllers ]       [ public ]    [ src ]
                                                                           |           |                    |           |
                                                                     cloudinary.js authController.js   favicon.ico      |
                                                                     db.js         hardwareController.js                |
                                                                                   healthController.js            +-----+-----+
                                                                                   iepController.js               |           |
                                                                                   routineController.js     [ components ][ context ]
                                                                                                                  |           |
                                                                           |           |                      [ charts ]  AuthContext.jsx
                                                                     [ middlewares ] [ routes ]               [ common ]  ThemeContext.jsx
                                                                           |           |                      [ layout ]
                                                                     authMiddleware.js authRoutes.js                          |
                                                                     errorHandler.js   hardwareRoutes.js                  [ pages ]
                                                                     rbacMiddleware.js healthRoutes.js                        |
                                                                                       routineRoutes.js                   [ admin ]
                                                                                                                          [ auth ]
                                                                           |           |                                  [ caretaker ]
                                                                        [ utils ] (backend files)                         [ parent ]
                                                                           |           |                                      
                                                                     llmNotifier.js   server.js                               |
                                                                   weatherEngine.js   package.json                       [ services ]
                                                                                      package-lock.json                       |
                                                                                                                           api.js
                                                                                                                              |
                                                                                                                         [ assets ]
                                                                                                                              |
                                                                                                                         (src files)
                                                                                                                          App.jsx
                                                                                                                          index.css
                                                                                                                          main.jsx
                                                                                                                              |
                                                                                                                       (frontend files)
                                                                                                                        index.html
                                                                                                                        postcss.config.js
                                                                                                                        tailwind.config.js
                                                                                                                        vite.config.js
                                                                                                                        package.json
                                                                                                                        package-lock.json
```
