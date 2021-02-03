// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

const ORIENTATIONS = ['W', 'N', 'E', 'S'];

 class Rover {
    constructor(xCoordinate, yCoordinate, orientation) {
        if (!Number.isInteger(xCoordinate) || !Number.isInteger(yCoordinate)) {
            throw new Error('Rover coordinates must be integers');
        }

        if (xCoordinate < 0 || yCoordinate < 0) {
            throw new Error('Rover coordinates must be non-negative');
        }

        if (ORIENTATIONS.indexOf(orientation) < 0) {
            throw new Error('Rover orientation must be one of "W, N, E, S"');
        }

        this.xCoordinate = xCoordinate;
        this.yCoordinate = yCoordinate;
        this.orientation = orientation;
    }

    move() {
        switch (this.orientation) {
            case 'W': {
                this.xCoordinate--;
                break;
            }
            case 'N': {
                this.yCoordinate++;
                break;
            }
            case 'E': {
                this.xCoordinate++;
                break;
            }
            case 'S': {
                this.yCoordinate--;
                break;
            }
            default:
                break;
        }
    }

    turnLeft() {
        const orientationIndex = ORIENTATIONS.indexOf(this.orientation) - 1;
        this.orientation = ORIENTATIONS[orientationIndex < 0 ? orientationIndex + 4 : orientationIndex];
    }

    turnRight() {
        const orientationIndex = ORIENTATIONS.indexOf(this.orientation) + 1;
        this.orientation = ORIENTATIONS[orientationIndex > 3 ? orientationIndex - 4 : orientationIndex];
    }
}
 class Plateau {
    constructor(xCoordinate, yCoordinate) {
        if (!Number.isInteger(xCoordinate) || !Number.isInteger(yCoordinate)) {
            throw new Error('Plateau coordinates must be integers');
        }

        if (xCoordinate <= 0 || yCoordinate <= 0) {
            throw new Error('Plateau coordinates must be positive');
        }

        this.xCoordinate = xCoordinate;
        this.yCoordinate = yCoordinate;
    }
}
 class Controller {
    constructor() {
        this.roverInfos = [];
        this.plateau = null;
    }

    printRoversLocation() {
        let res = [];
        this.roverInfos.forEach(roverInfos => {
            const rover = roverInfos.rover;
            res.push(`${rover.xCoordinate} ${rover.yCoordinate} ${rover.orientation}`);
        });

        return res.join('\n');
    }

    executeInstructions(instruction) {
        const instructions = this.instructionSplitAndTrim(instruction);

        const plateauInstructions = instructions.plateauInstructions;
        this.setPlateauFromInstruction(plateauInstructions);

        instructions.roverInstructions.forEach(roverInstruction => {
            this.setRoverFromInstruction(roverInstruction);
        });

       // to print the initial cordninates

        document.getElementById("initialLabel").innerText += this.printRoversLocation();
        this.roverInfos.forEach(roverInfo => {
            this.moveRoverFromInstructions(roverInfo.rover, roverInfo.moveRoverInstruction, this.canMoveStrategy);
        });
    }

    validateSetPlateauInstruction(instruction) {
        return /^\d+\s+\d+$/.test(instruction);
    }

    validateSetRoverInstruction(instruction) {
        return /^\d+\s\d+\s[ENSW]$/.test(instruction);
    }

     validateMoveRoverInstruction(instruction) {
         return /^[RLM]+$/.test(instruction.trim());
    }

    instructionSplitAndTrim(instruction) {
        let instructionLines = instruction.trim().split('\n');
        instructionLines = instructionLines.filter(instructionLine => {
            return instructionLine.trim() !== '';
        });

        const plateauInstructions = instructionLines[0];//Size of the plateau

        const roverInstructionLines = instructionLines.slice(1);

        let roverInstructions = [];
        
        for (let i = 0; i < roverInstructionLines.length; i += 1) {
           
            let parameters = roverInstructionLines[i].split('|');
            roverInstructions.push(
                {
                   
                    setRoverInstruction: parameters[0],
                    moveRoverInstruction: parameters[1].trim()
                });
        }

        return {
            plateauInstructions,
            roverInstructions,
        }
    }

    setPlateauFromInstruction(plateauInstruction) {
        if (!this.validateSetPlateauInstruction(plateauInstruction)) {
            throw Error(`Plateau instructions is not correct: "${plateauInstruction}"`);
        }
        const args = plateauInstruction.split(' ').map(i => parseInt(i));

        this.plateau = new Plateau(...args);
    }

    setRoverFromInstruction({ setRoverInstruction, moveRoverInstruction }) {
        if (!this.plateau) {
            throw Error('Plateau is not set, you can\'t set rover');
        }

        let args = setRoverInstruction.split(' ');
        args = args.slice(0, 2).map(i => parseInt(i)).concat(args[2]);

        if (this.plateau.xCoordinate < args[0] || this.plateau.yCoordinate < args[1]) {
            throw Error(`Rover can't be set out of Plateau`)
        }

        if (!this.validateSetRoverInstruction(setRoverInstruction)) {
            throw Error(`Rover set instruction is not correct: "${setRoverInstruction}"`);
        }

        if (!this.validateMoveRoverInstruction(moveRoverInstruction)) {
            throw Error(`Rover move instruction is not correct: "${moveRoverInstruction}"`);
        }

        this.roverInfos.push({ rover: new Rover(...args), moveRoverInstruction })
    }

    canMoveStrategy(rover, rovers, plateau) {
        const maxXCoordinate = plateau.xCoordinate;
        const maxYCoordinate = plateau.yCoordinate;

        let xCoordinate = rover.xCoordinate;
        let yCoordinate = rover.yCoordinate;
        let orientation = rover.orientation;

        let mockRover = { xCoordinate, yCoordinate, orientation };
        rover.move.apply(mockRover);
        const afterMoveStillInPlateau = mockRover.xCoordinate <= maxXCoordinate &&
            mockRover.yCoordinate <= maxYCoordinate &&
            mockRover.xCoordinate >= 0 &&
            mockRover.yCoordinate >= 0;

        let theNextCoordinateIsAvailable = true;
        let roverIndex = rovers.indexOf(rover);
        rovers.slice(0, roverIndex).forEach(rover => {
            if (rover.xCoordinate === mockRover.xCoordinate && rover.yCoordinate === mockRover.yCoordinate) {
                theNextCoordinateIsAvailable = false;
            }
        });
        return afterMoveStillInPlateau && theNextCoordinateIsAvailable;
    }

    moveRoverFromInstructions(rover, moveRoverInstructions, canMoveStrategy) {
        for (let instruction of moveRoverInstructions) {
            this.moveRoverFromInstruction(rover, instruction, canMoveStrategy);
        }
    }

    moveRoverFromInstruction(rover, instruction, canMoveStrategy) {
        switch (instruction) {
            case 'M':
                if (canMoveStrategy) {
                    if (canMoveStrategy(rover, this.roverInfos.map(roverInfo => roverInfo.rover), this.plateau)) {
                        rover.move();
                    }
                } else {
                    rover.move();
                }
                break;
            case 'L':
                rover.turnLeft();
                break;
            case 'R':
                rover.turnRight();
                break;
            default:
                throw Error(`Unknown Rover move instruction: "${instruction}"`);
        }
    }
}

function handleFiles(files) {
    document.getElementById("initialLabel").innerHTML = "";
    document.getElementById("resultLabel").innerHTML = "";

    // Check for the various File API support.
    if (window.FileReader) {
        // FileReader are supported.
        getAsText(files[0]);
    } else {
        alert('FileReader are not supported in this browser.');
    }
}

function getAsText(fileToRead) {
    var reader = new FileReader();
    // Read file into memory as UTF-8      
    reader.readAsText(fileToRead);
    // Handle errors load
    reader.onload = loadHandler;
    reader.onerror = errorHandler;
}

function loadHandler(event) {
    var csv = event.target.result;
    processData(csv);
}
function processData(csv) {
    try
    {
        const controller = new Controller();
        controller.executeInstructions(csv);
        document.getElementById("resultLabel").innerText = controller.printRoversLocation();
    }
    catch (err)
    {
       document.getElementById("initialLabel").innerHTML = "<span style='color: red;'>" + err + "</span>";
    }
  }
function errorHandler(evt) {
    if (evt.target.error.name == "NotReadableError") {
        alert("Canno't read file !");
    }
}



 

