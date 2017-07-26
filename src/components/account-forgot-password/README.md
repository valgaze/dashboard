# AccountForgotPassword

This component contains the forgot password form. It's a stateful component that holds the state of all
the form fields, and is the "page component" for the forgot password page (use on the second leg of
the forgot password process).

Behind the scenes, a password reset token is passed to this page in the url (as part of the url in
an named url parameter). After the user clicks confirm in that flow, a request is made to the
accounts api to finish the process, passing the reset token along with their password.

## Component Props
(none, connected)
