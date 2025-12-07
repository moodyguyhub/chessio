# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - link [ref=e5] [cursor=pointer]:
        - /url: /
        - img [ref=e6]:
          - generic [ref=e14]: Chessio
      - heading "Welcome back" [level=1] [ref=e16]
      - paragraph [ref=e17]: Sign in to continue your journey
    - generic [ref=e18]:
      - generic [ref=e19]:
        - generic [ref=e20]:
          - generic [ref=e21]: Email
          - textbox "Email" [ref=e22]:
            - /placeholder: you@example.com
        - generic [ref=e23]:
          - generic [ref=e24]: Password
          - textbox "Password" [ref=e25]:
            - /placeholder: Your password
        - button "Sign In" [ref=e26]
      - generic [ref=e27]:
        - text: Don't have an account?
        - link "Sign up" [ref=e28] [cursor=pointer]:
          - /url: /register
  - button "Open Next.js Dev Tools" [ref=e34] [cursor=pointer]:
    - img [ref=e35]
  - alert [ref=e38]
```