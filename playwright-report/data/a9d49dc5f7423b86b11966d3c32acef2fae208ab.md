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
      - heading "Create your account" [level=1] [ref=e26]
      - paragraph [ref=e27]: Start your chess journey today
    - generic [ref=e28]:
      - generic [ref=e29]:
        - generic [ref=e30]:
          - generic [ref=e31]: Name
          - textbox "Name" [ref=e32]:
            - /placeholder: Your name
        - generic [ref=e33]:
          - generic [ref=e34]: Email
          - textbox "Email" [ref=e35]:
            - /placeholder: you@example.com
        - generic [ref=e36]:
          - generic [ref=e37]: Password
          - textbox "Password" [ref=e38]:
            - /placeholder: At least 6 characters
        - button "Create Account" [ref=e39]
      - generic [ref=e40]:
        - text: Already have an account?
        - link "Sign in" [ref=e41] [cursor=pointer]:
          - /url: /login
```