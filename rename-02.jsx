win = new Window("dialog", "レイヤー名変更");
win.bounds = {
	width: 280,
	height: 300,
	x: 600,
	y: 400
};
okbtn = win.add("button", {
	width: 70,
	height: 25,
	x: 40,
	y: 20
}, "OK");
cnbtn = win.add("button", {
	width: 70,
	height: 25,
	x: 160,
	y: 20
}, "Cancel");

var layerSet = app.activeDocument.activeLayer.name;
Text01 = win.add("edittext", {
	width: 240,
	height: 20,
	x: 20,
	y: 60
}, layerSet);

Text02 = win.add("edittext", {
	width: 105,
	height: 20,
	x: 155,
	y: 100
}, "");
rBtn1 = win.add("radiobutton", {
	width: 70,
	height: 20,
	x: 20,
	y: 100
}, "文字置換【固定】");

rBtn2 = win.add("radiobutton", {
	width: 70,
	height: 20,
	x: 20,
	y: 140
}, "連番追加【最初】");
rBtn3 = win.add("radiobutton", {
	width: 70,
	height: 20,
	x: 155,
	y: 140
}, "連番追加【最後】");

rBtn4 = win.add("radiobutton", {
	width: 70,
	height: 20,
	x: 20,
	y: 180
}, "文字追加【最初】");
rBtn5 = win.add("radiobutton", {
	width: 70,
	height: 20,
	x: 155,
	y: 180
}, "文字追加【最後】");

cap = win.add("statictext", {
	width: 70,
	height: 20,
	x: 20,
	y: 220
}, "zero padding");
Text03 = win.add("edittext", {
	width: 105,
	height: 20,
	x: 155,
	y: 220
}, "1");

cap2 = win.add("statictext", {
	width: 70,
	height: 20,
	x: 20,
	y: 260
}, "number of continued");
Text05 = win.add("edittext", {
	width: 105,
	height: 20,
	x: 155,
	y: 260
}, "1");



//デフォルトで【OK】ボタンがアクティブ
okbtn.active = true;

okbtn.onClick = function () {

	//各条件に当てはまる関数の実行の分岐
	if (rBtn1.value == true) {
		app.activeDocument.suspendHistory("文字置換【固定】", "main06()");
	} else if (rBtn2.value == true) {
		app.activeDocument.suspendHistory("連番追加【最初】", "main02()");
	} else if (rBtn3.value == true) {
		app.activeDocument.suspendHistory("連番追加【最後】", "main03()");
	} else if (rBtn4.value == true) {
		app.activeDocument.suspendHistory("文字追加【最初】", "main04()");
	} else if (rBtn5.value == true) {
		app.activeDocument.suspendHistory("文字追加【最後】", "main05()");
	} else {
		app.activeDocument.suspendHistory("代入", "main01()");
	}

	//上の関数実行命令後にWindowを閉じる
	win.close();
}
win.show();


//代入変更の関数
function main01() {
	if (app.documents.length) {
		var docRef = app.activeDocument;
		if (docRef.layers.length) {
			var selected = getSelectedLayersIdx();
			for (var i = 0; i < selected.length; i++) {
				var assetName = Text01.text;
				selectByIndex(selected[i]).name = assetName;
			}
		}
	}
}


//連番追加【最初】の関数
function main02() {
	if (app.documents.length) {
		var docRef = app.activeDocument;
		if (docRef.layers.length) {
			var selected = getSelectedLayersIdx();
			var hoi = "-" + eval(Text03.text);
			var foi = hoi.replace("9", "10").replace("8", "9").replace("7", "8").replace("6", "7").replace("5", "6").replace("4", "5").replace("3", "4").replace("2", "3").replace("1", "2");
			if ((Text01.text == "") && (hoi != -0)) {
				for (var i = 0; i < selected.length; i++) {
					var voi = i + eval(Text05.text);
					var xoi = ('00000000000000000000000000000000000000000000000000' + voi).slice(foi);
					var assetName = xoi + selectByIndex(selected[i]).name;
					selectByIndex(selected[i]).name = assetName;
				}
			} else if ((Text01.text != "") && (hoi != -0)) {
				for (var i = 0; i < selected.length; i++) {
					var voi = i + eval(Text05.text);
					var xoi = ('00000000000000000000000000000000000000000000000000' + voi).slice(foi);
					var assetName = xoi + Text01.text;
					selectByIndex(selected[i]).name = assetName;
				}
			} else if ((Text01.text == "") && (hoi == -0)) {
				for (var i = 0; i < selected.length; i++) {
					var voi = i + eval(Text05.text);
					var assetName = voi + selectByIndex(selected[i]).name;
					selectByIndex(selected[i]).name = assetName;
				}
			} else if ((Text01.text != "") && (hoi == -0)) {
				for (var i = 0; i < selected.length; i++) {
					var voi = i + eval(Text05.text);
					var assetName = voi + Text01.text;
					selectByIndex(selected[i]).name = assetName;
				}
			} else {}
		}
	}
}


//連番追加【最後】の関数
function main03() {
	if (app.documents.length) {
		var docRef = app.activeDocument;
		if (docRef.layers.length) {
			var selected = getSelectedLayersIdx();
			var hoi = "-" + eval(Text03.text);
			var foi = hoi.replace("9", "10").replace("8", "9").replace("7", "8").replace("6", "7").replace("5", "6").replace("4", "5").replace("3", "4").replace("2", "3").replace("1", "2");
			if ((Text01.text == "") && (hoi != -0)) {
				for (var i = 0; i < selected.length; i++) {
					var voi = i + eval(Text05.text);
					var xoi = ('00000000000000000000000000000000000000000000000000' + voi).slice(foi);
					var assetName = selectByIndex(selected[i]).name  + xoi;
					selectByIndex(selected[i]).name = assetName;
				}
			} else if ((Text01.text != "") && (hoi != -0)) {
				for (var i = 0; i < selected.length; i++) {
					var voi = i + eval(Text05.text);
					var xoi = ('00000000000000000000000000000000000000000000000000' + voi).slice(foi);
					var assetName = Text01.text + xoi;
					selectByIndex(selected[i]).name = assetName;
				}
			} else if ((Text01.text == "") && (hoi == -0)) {
				for (var i = 0; i < selected.length; i++) {
					var voi = i + eval(Text05.text);
					var assetName = selectByIndex(selected[i]).name + voi;
					selectByIndex(selected[i]).name = assetName;
				}
			} else if ((Text01.text != "") && (hoi == -0)) {
				for (var i = 0; i < selected.length; i++) {
					var voi = i + eval(Text05.text);
					var assetName = Text01.text + voi;
					selectByIndex(selected[i]).name = assetName;
				}
			} else {}
		}
	}
}


//文字追加【最初】の関数
function main04() {
	if (app.documents.length) {
		var docRef = app.activeDocument;
		if (docRef.layers.length) {
			var selected = getSelectedLayersIdx();
			if (Text01.text == "") {
				for (var i = 0; i < selected.length; i++) {
					var assetName = selectByIndex(selected[i]).name;
					selectByIndex(selected[i]).name = assetName;
				}
			} else {
				for (var i = 0; i < selected.length; i++) {
					var assetName = Text01.text + selectByIndex(selected[i]).name;
					selectByIndex(selected[i]).name = assetName;
				}
			}
		}
	}
}


//文字追加【最後】の関数
function main05() {
	if (app.documents.length) {
		var docRef = app.activeDocument;
		if (docRef.layers.length) {
			var selected = getSelectedLayersIdx();
			if (Text01.text == "") {
				for (var i = 0; i < selected.length; i++) {
					var assetName = selectByIndex(selected[i]).name;
					selectByIndex(selected[i]).name = assetName;
				}
			} else {
				for (var i = 0; i < selected.length; i++) {
					var assetName = selectByIndex(selected[i]).name + Text01.text;
					selectByIndex(selected[i]).name = assetName;
				}
			}
		}
	}
}


//置換の関数
function main06() {
	if (app.documents.length) {
		var docRef = app.activeDocument;
		if (docRef.layers.length) {
			var selected = getSelectedLayersIdx();
			if (Text01.text == "") {
				for (var i = 0; i < selected.length; i++) {
					var assetName = selectByIndex(selected[i]).name;
					selectByIndex(selected[i]).name = assetName;
				}
			} else {
				for (var i = 0; i < selected.length; i++) {
					var before = Text01.text;
					var regExp = new RegExp(before, "g");
					var testtext = selectByIndex(selected[i]).name;
					var assetName = testtext.replace(regExp, Text02.text);
					selectByIndex(selected[i]).name = assetName;
				}
			}
		}
	}
}


//各、アクティブレイヤーのデータ取得の関数
function getSelectedLayersIdx() {
	var selectedLayers = new Array;
	var ref = new ActionReference();
	ref.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
	var desc = executeActionGet(ref);

	if (desc.hasKey(stringIDToTypeID('targetLayers'))) {
		desc = desc.getList(stringIDToTypeID('targetLayers'));
		var c = desc.count
		var selectedLayers = new Array();
		for (var i = 0; i < c; i++) {
			try {
				activeDocument.backgroundLayer;
				selectedLayers.push(desc.getReference(i).getIndex());
			} catch (e) {
				selectedLayers.push(desc.getReference(i).getIndex() + 1);
			}
		}
	} else {
		var ref = new ActionReference();
		ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("ItmI"));
		ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
		try {
			activeDocument.backgroundLayer;
			selectedLayers.push(executeActionGet(ref).getInteger(charIDToTypeID("ItmI")) - 1);
		} catch (e) {
			selectedLayers.push(executeActionGet(ref).getInteger(charIDToTypeID("ItmI")));
		}

		var vis = app.activeDocument.activeLayer.visible;
		if (vis == true) app.activeDocument.activeLayer.visible = false;
		var desc9 = new ActionDescriptor();
		var list9 = new ActionList();
		var ref9 = new ActionReference();
		ref9.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
		list9.putReference(ref9);
		desc9.putList(charIDToTypeID('null'), list9);
		executeAction(charIDToTypeID('Shw '), desc9, DialogModes.NO);
		if (app.activeDocument.activeLayer.visible == false) selectedLayers.shift();
		app.activeDocument.activeLayer.visible = vis;
	}
	return selectedLayers;
}


//取得データの格納、使用型に変更の関数
function selectByIndex(idx) {
	if (idx == 0) return;
	if (idx.length != undefined) {
		idx = idx[0];
	}
	var desc = new ActionDescriptor();
	var ref = new ActionReference();
	ref.putIndex(charIDToTypeID('Lyr '), idx);
	desc.putReference(charIDToTypeID('null'), ref);
	executeAction(charIDToTypeID('slct'), desc, DialogModes.NO);
	return app.activeDocument.activeLayer;
}


//alert(debaggu);
