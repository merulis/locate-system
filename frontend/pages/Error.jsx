import { NavLink } from "react-router-dom";

export default function ErrorPage() {
  return (
    <>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <NavLink to='/'>На главную</NavLink>
    </>
  );
}