# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]: Sign In – Chessio
  - generic [ref=e13]:
    - generic [ref=e14]:
      - link [ref=e15] [cursor=pointer]:
        - /url: /
        - img [ref=e16]:
          - generic [ref=e24]: Chessio
      - heading "Welcome back" [level=1] [ref=e26]
      - paragraph [ref=e27]: Sign in to continue your journey
    - generic [ref=e28]:
      - generic [ref=e29]:
        - generic [ref=e30]:
          - generic [ref=e31]: Email
          - textbox "Email" [ref=e32]:
            - /placeholder: you@example.com
        - generic [ref=e33]:
          - generic [ref=e34]: Password
          - textbox "Password" [ref=e35]:
            - /placeholder: Your password
        - button "Sign In" [ref=e36]
      - generic [ref=e37]:
        - text: Don't have an account?
        - link "Sign up" [ref=e38] [cursor=pointer]:
          - /url: /register
```