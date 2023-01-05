import { gql, useMutation } from "@apollo/client";
import { ChangeEvent, useState } from "react";

const MUTATION = gql`
  mutation SingleUpload($file: Upload!) {
    singleUpload(file: $file) {
      url
    }
  }
`;

const App = () => {
  const [imgUrl, setImgUrl] = useState<string>("");

  const [mutate] = useMutation(MUTATION, {
    onCompleted: (data) => {
      setImgUrl(data.singleUpload?.url);
    },
  });

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (file) await mutate({ variables: { file } });
  };

  return (
    <div>
      <input type="file" required onChange={handleChange} />
      <img src={imgUrl} alt="" style={{ width: "400px", height: "auto" }} />
    </div>
  );
};

export default App;
