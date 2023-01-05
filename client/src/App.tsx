import { gql, useMutation } from "@apollo/client";
import { ChangeEvent } from "react";

const MUTATION = gql`
  mutation SingleUpload($file: File!) {
    singleUpload(file: $file) {
      url
    }
  }
`;

const App = () => {
  const [mutate] = useMutation(MUTATION);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (file) await mutate({ variables: { file } });
  };

  return (
    <div>
      <input type="file" required onChange={handleChange} />
    </div>
  );
};

export default App;
