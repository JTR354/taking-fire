/**@jsx CReact.createElement */
import CReact, { update } from "./core/react.js";

const Child = () => {
  return <div>child</div>;
};

let showBar = true;
const Counter = ({ num }) => {
  return <div>{showBar ? <Child /> : <p>p</p>}</div>;
};

const App = () => (
  <div className="red">
    <h1>mini-react</h1>
    <input placeholder="mini-react" />
    <button
      onClick={() => {
        console.log("leo");
        showBar = !showBar;
        update();
      }}
    >
      add
    </button>
    <Counter num={1} />
  </div>
);

export default App;
