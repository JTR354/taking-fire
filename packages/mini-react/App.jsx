/**@jsx CReact.createElement */
import CReact, { update } from "./core/react.js";

const Child = () => {
  return (
    <div>
      child
      <p>child1</p>
      <p>child2</p>
      <p>child3</p>
    </div>
  );
};

let showBar = true;
const Counter = ({ num }) => {
  const foo = (
    <div>
      foo
      <p>child1</p>
      <p>child2</p>
      <p>child3</p>
    </div>
  );

  const bar = <div>bar</div>;
  return <div>{showBar ? bar : foo}</div>;
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
