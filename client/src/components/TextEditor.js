// import Editor from "@ckeditor/ckeditor5-build-classic";
// import { CKEditor } from "@ckeditor/ckeditor5-react";

// export default function TextEditor({ onChange, editorLoaded, name, value }) {
//   const editorConfiguration = {
//     toolbar: {
//       items: [
//         "heading",
//         "|",
//         "bold",
//         "italic",
//         "link",
//         "bullededList",
//         "numberedList",
//         "|",
//         "outdent",
//         "indent",
//         "|",
//         "imageUpload",
//         "blockQuote",
//         "insertTable",
//         "mediaEmbed",
//         "und",
//         "redo",
//         "alignment",
//         "code",
//         "codeBlock",
//         "findAndReplace",
//         "fontColor",
//         "fontFamily",
//         "fontSize",
//         "fontBackgroundColor",
//         "highlight",
//         "horizontalline",
//         "htmlEmbed",
//         "imageInsert",
//       ],
//     },
//     language: "en",
//     image: {
//       toolbar: [
//         "imageTextAlternative",
//         "toggleImageCaption",
//         "imageStyle:inline",
//         "imageStyle:block",
//         "imageStyle:side",
//       ],
//     },
//     table: {
//       contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
//     },
//   };
//   return (
//     <>
//       <CKEditor
//         editor={Editor}
//         config={editorConfiguration}
//         data={value}
//         onChange={(event, editor) => {
//           const data = editor.getData();
//           console.log(data);
//         }}
//       />
//     </>
//   );
// }

import { useEffect, useRef } from "react";

export default function Editor({ onChange, editorLoaded, name, value }) {
  const editorRef = useRef();
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };
  }, []);

  return (
    <div>
      {editorLoaded ? (
        <CKEditor
          type=""
          name={name}
          editor={ClassicEditor}
          data={value}
          onChange={(event, editor) => {
            const data = editor.getData();
            onChange(data);
          }}
        />
      ) : (
        <div>Đang tải nội dung</div>
      )}
    </div>
  );
}
