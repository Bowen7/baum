import { NdTree } from "./index";
const data = [
  {
    name: 1,
    children: [
      {
        name: 2,
        children: [{ name: 3 }, { name: 4, children: [{ name: 5 }] }],
      },
    ],
  },
];
function App() {
  return <NdTree data={data} />;
}

export default App;
