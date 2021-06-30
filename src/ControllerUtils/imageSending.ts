import fs from "fs";
import path from "path";

export const uploadTaskImages = async (
  req: any,
  isInstructor: boolean,
  track?: string,
  studentId?: string
) => {
  let uploadPath = "";
  if (isInstructor) {
    // Instructor will send in the tasks
    uploadPath = `/uploads/tasks/${track}`;
  } else {
    // Student has uploaded after editing
    uploadPath = `/uploads/student/${studentId}`;
  }

  let imagePath: string = "";
  let fileName = new Date().getTime();
  const files = req.files;
  await files.forEach(
    async (
      file: {
        mimetype: string;
        buffer:
          | string
          | Uint8Array
          | Uint8ClampedArray
          | Uint16Array
          | Uint32Array
          | Int8Array
          | Int16Array
          | Int32Array
          | BigUint64Array
          | BigInt64Array
          | Float32Array
          | Float64Array
          | DataView;
      },
      index: any
    ) => {
      try {
        if (
          !fs.existsSync(
            path.normalize(`${__dirname}/../..${uploadPath}/${fileName}`)
          )
        ) {
          fs.mkdirSync(
            path.normalize(`${__dirname}/../..${uploadPath}/${fileName}`)
          );
        }
        fs.writeFile(
          path.normalize(
            `${__dirname}/../..${uploadPath}/${fileName}/${fileName}${index}.${
              file.mimetype.split("/")[1]
            }`
          ),
          file.buffer,
          (err) => {
            if (err) {
              console.log(err);
              return;
            }
            console.log(
              path.normalize(
                `${__dirname}/../..${uploadPath}/${fileName}/${fileName}${index}.${
                  file.mimetype.split("/")[1]
                }`
              )
            );
          }
        );
        imagePath = `${uploadPath}/${fileName}/${fileName}${index}.${
          file.mimetype.split("/")[1]
        }`;
      } catch (e) {
        console.log(e);
        console.log("Error in saving");
        return;
        // throw "Error in saving";
      }
    }
  );
  return imagePath;
};
