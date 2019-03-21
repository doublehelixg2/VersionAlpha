var config = require("./config");
const shell = require("shelljs");
var fs = require("fs");

var child_process = require("child_process");

var childProcess = [];
var childstarted = [];
var childPid = [];
var previous = "";
var next = "";
var parray = [];
var narray = [];

console.log("[STREAM STARTED]");
console.log(config.URL);

function readInput() {
  shell.exec("cp web/views/video/INPUT web/views/video/INPUT2");
  try {
    fs.readFile("web/views/video/INPUT2", "utf8", (err, contents) => {
      next = contents;
      if (previous == next) {
        //console.log("No change in stream");
      } else {
        console.log("\nNew content detected");

        var array = contents.toString().split("\n");
        if (array.length < parray.length) {
          for (var jj = parray.length - 1; jj >= array.length; jj--) {
            try {
              console.log("First pop");
              childProcess[i].stdin.write("q");
              childstarted[jj] = "killed";
              console.log("[STREAM] Popping: " + parray[jj]);

              parray.pop();
            } catch (err2) {
              console.log("Already popped");
            }
          }
        }
        for (i in array) {
          if (array[i] == parray[i]);
          else {
            //console.log("Change detected in: " + array[i]);
            stopItnow(i);
            var insplits = array[i].split(",");
            console.log(insplits[1]);

            if (insplits[3] == "disabled") {
              console.log("[STREAM]: DISABLED " + insplits[0]);
            } else {
              console.log(
                'web/views/video/stream.sh "' +
                insplits[0] +
                '" "' +
                "http://192.168.43.33:8080/video" +
                '" "' +
                config.URL +
                '" "' +
                insplits[2] +
                '"'
              );
              childProcess[i] = shell.exec(
                'web/views/video/stream.sh "' +
                insplits[0] +
                '" "' +
                insplits[1] +
                '" "' +
                config.URL +
                '" "' +
                insplits[2] +
                '"',
                { async: true, silent: false }
              );

              console.log("[STREAM]: Started: " + insplits[0]);
              childstarted[i] = "started";
            }
            parray[i] = array[i];
          }
        }
        previous = next;
      }
    });
  } catch (err0) { }
}
setInterval(readInput, 3 * 1000);
readInput();

function stopItnow(i) {
  if (childstarted[i] == "started") {
    console.log("[STREAM] Killed: " + parray[i]);
    try {
      childProcess[i].stdin.write("q");
    } catch (errr) {
      //stopItnow(i);
      console.log("Stream already stopped");
    }
  }
  childstarted[i] == "killed";
}

function startItnow(i) {
  if (childstarted[i] == "started") {
    stopItnow(i);
    console.log("[STREAM] Killed: " + parray[i]);
    try {
      childProcess[i].stdin.write("q");
    } catch (errr) {
      //stopItnow(i);
      console.log("Stream already stopped");
    }
    childstarted[i] == "killed";
  }
}
