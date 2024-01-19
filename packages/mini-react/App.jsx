/**@jsx CReact.createElement */
import CReact, { update } from "./core/react.js";

const Child = () => {
  return <div>child</div>;
};

let count = 0;
const Counter = ({ num }) => {
  return (
    <div>
      {num}
      {count}
      <Child></Child>
    </div>
  );
};

const App = () => (
  <div className="red">
    <h1>mini-react</h1>
    <input placeholder="mini-react" />
    <button
      onClick={() => {
        console.log("leo");
        count++;
        update();
      }}
    >
      add
    </button>
    <Counter num={1} />
    <Counter num={12} />
  </div>
);

export default App;
