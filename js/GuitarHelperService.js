/**
 * Module description
 * @class GuitarService
 */
app.service('GuitarHelperService', function() {
	/**
	 * [flatNotes description]
	 * @type {Array}
	 */

	//TODO use index for all variables, remove "index" from variable names

	//TODO capitalize these constants
	var flatNotes = ["Ab","A","Bb","B","C","Db","D","Eb","E","F","Gb","G"];
	var sharpNotes = ["G#","A","A#","B","C","C#","D","D#","E","F","F#","G"];
	var numFrets = 12;
	var numStrings = 6;
	

	var SCALES = [
		{name: "Major scale", notes: [0, 2, 4, 5, 7, 9, 11]},
		{name: "Mixolydian mode" , notes: [0, 2, 4, 5, 7, 9, 10]},
		{name: "Lydian mode", notes: [0, 2, 4, 6, 7, 9, 11] },
		{name: "Lydian dominant mode", notes: [0, 2, 4, 6, 7, 9, 10]},
		{name: "Phrygian dominant mode", notes: [0, 2, 4, 5, 7, 8, 11]},
		{name: "Harmonic major scale", notes: [0, 2, 4, 5, 7, 8, 11]},
		{name: "Natural minor scale", notes: [0, 2, 3, 5, 7, 8, 10]},
		{name: "Dorian mode", notes: [0, 2, 3, 5, 7, 9, 10]},
		{name: "Harmonic minor scale", notes: [0, 2, 3, 5, 7, 8, 11]},
		{name: "Melodic minor scale", notes: [0, 2, 3, 5, 7, 9, 11]},
		{name: "Phrygian mode", notes: [0, 1, 3, 5, 7, 8, 10]},
		{name: "Locrian mode", notes: [0, 1, 3, 5, 6, 8, 10]},
		{name: "Blues scale", notes: [0, 3, 5, 6, 7, 10]},
		{name: "Altered scale", notes: [0, 1, 3, 4, 6, 8, 10]},
		{name: "Major pentatonic scale", notes: [0, 2, 4, 7, 9]},
		{name: "Minor pentatonic scale", notes: [0, 3, 5, 7, 10]},
		{name: "Chromatic Scale", notes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]},
		{name: "Whole tone scale", notes: [0, 2, 4, 6, 8, 10]},
		{name: "Octatonic scale", notes: [0, 2, 3, 5, 6, 8, 9, 11]},
		{name: "Hexatonic scale", notes: [0, 3, 4, 7, 8, 11]}
	]

	// takes in note name string and returns corresponding index
	var getNoteIndex = function(noteName) {
		switch  (noteName) {
			case "G#":
			case "Ab":
				return 0;
			case "A":
				return 1;
			case "A#":
			case "Bb":
				return 2;
			case "B":
				return 3;
			case "C":
				return 4;
			case "C#":
			case "Db":
				return 5;
			case "D":
				return 6;
			case "D#":
			case "Eb":
				return 7;
			case "E":
				return 8;
			case "F":
				return 9;
			case "F#":
			case "Gb":
				return 10;
			case "G":
				return 11;
				break;
		}
	}

	var buildScale = function (rootNote, scaleIndex) {
		// Get scale from index
		var scale = SCALES[scaleIndex].notes;

		// Index of root note in scale
		var rootIndex = getNoteIndex(rootNote);
		// Return array that will hold indices of all the notes in the scale
		var noteIndexInKey = [];

		// Loop through the scale array (starting on the root) and add to return array
		for (var i = 0; i < scale.length; i++) {
			noteIndexInKey.push((rootIndex + scale[i]) % 12);
		}

		return noteIndexInKey;
	}

	// tuning parameter is the open note the string is tuned to
	//TODO change that variable name to openNote
	var buildString = function (tuning, noteIndexInKey, flatNotation) {
		var noteIndex = getNoteIndex(tuning);
		var frets = [];

		for (j=0;j<numFrets;j++) {
			noteIndex = (noteIndex + 1) % 12;
			var highlight = false;
			var isRoot = false;
			if(noteIndexInKey.indexOf(noteIndex) != -1)
			{
				highlight = true;

				// If the note is the at position 0 in noteIndexInKey array
				// then it is the root note
				if(noteIndexInKey.indexOf(noteIndex) == 0) {
					isRoot = true;
				}
			}

			var note = flatNotation ? flatNotes[noteIndex] : sharpNotes[noteIndex];
			var fret = {note: note, highlight: highlight, isRoot: isRoot};
			frets.push(fret);
		}

		var string = {frets: frets};

		return string;
	}

	var buildFretboard = function (settings) {
		var currentTuning = settings.currentTuning;
		var flatNotation = settings.isFlat;
		var noteIndexInKey = buildScale(settings.currentKey, settings.currentScale);

		var strings = [];
		var openInKey = [];
		var openIsRoot = [];

		for (i=0;i<numStrings;i++) {
			var openNoteIndex = getNoteIndex(currentTuning[i])
			//TODO should be openIsInKey
			var isInKey = noteIndexInKey.includes(openNoteIndex);
			var isRoot = (noteIndexInKey[0] == openNoteIndex);

			openInKey.push(isInKey);
			openIsRoot.push(isRoot);
			strings.push(buildString(currentTuning[i],noteIndexInKey,flatNotation));
		}

		fretboard = {strings: strings, openInKey: openInKey, openIsRoot: openIsRoot};
		return fretboard;
	}

	// var changeStringTuning = function (stringIndex, newNote) {
	// 	fretboard.strings[stringIndex] = buildString(newNote);
	// }

	// var changeTuning = function (tuning, flat) {
	// 	isFlat = flat;
	// 	var noteArray = tuning.slice().reverse();
	// 	currentTuning = noteArray;
	// 	for(i=0;i<noteArray.length;i++){
	// 		changeStringTuning(i, noteArray[i]);
	// 	}
	// 	return;
	// }

	this.scales = SCALES;
	this.buildFretboard = buildFretboard;
});