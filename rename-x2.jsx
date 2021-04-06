win = new Window("dialog", "アセット設定");
win.bounds  = [600,400,880,545];
okbtn = win.add("button", { width: 80, height: 25, x: 40, y: 25 }, "OK");
cnbtn = win.add("button", { width: 80, height: 25, x: 160, y: 25 }, "Cancel");
chBox = win.add("Checkbox",[40,80,275,10+20],"画像の2倍(@2x)");
rBtn1 = win.add("radiobutton",[40,110,80,10+20], "PNG形式");
rBtn2 = win.add("radiobutton",[160,110,80,30+20], "JPEG形式");
okbtn.active = true;

okbtn.onClick = function () {
	if ((rBtn1.value == true) && (chBox.value == false)) {
		app.activeDocument.suspendHistory("1倍JPEGリネーム", "main01()");
	} else if ((rBtn1.value == true) && (chBox.value == true)) {
		app.activeDocument.suspendHistory("2倍JPEGリネーム", "main02()");
	} else if ((rBtn1.value == false) && (chBox.value == false)) {
		app.activeDocument.suspendHistory("1倍PNGリネーム", "main03()");
	} else if ((rBtn1.value == false) && (chBox.value == true)) {
		app.activeDocument.suspendHistory("2倍PNGリネーム", "main04()");
	} else {
		app.activeDocument.suspendHistory("1倍JPEGリネーム", "main01()");
	}
	win.close();
}
win.show();


//※if文で分けるより複数書く方が処理が軽かった。
	//参照渡し、配列の複数渡しの、処理範囲。
function main01() {
	if (app.documents.length) {
		var docRef = app.activeDocument;
		if (docRef.layers.length) {
			var selected = getSelectedLayersIdx();
			for (var i = 0; i < selected.length; i++) {
				var assetName = selectByIndex(selected[i]).name + ".png";
				selectByIndex(selected[i]).name = assetName;
			}
		}
	}
}

function main02() {
	if (app.documents.length) {
		var docRef = app.activeDocument;
		if (docRef.layers.length) {
			var selected = getSelectedLayersIdx();
			for (var i = 0; i < selected.length; i++) {
				// var assetName = selectByIndex(selected[i]).name + ".png, " + "200% " + selectByIndex(selected[i]).name+ "@2x.png";
				var assetName = "200% " + selectByIndex(selected[i]).name+ "@2x.png";
				selectByIndex(selected[i]).name = assetName;
			}
		}
	}
}

function main03() {
	if (app.documents.length) {
		var docRef = app.activeDocument;
		if (docRef.layers.length) {
			var selected = getSelectedLayersIdx();
			for (var i = 0; i < selected.length; i++) {
				var assetName = selectByIndex(selected[i]).name + ".jpg";
				selectByIndex(selected[i]).name = assetName;
			}
		}
	}
}

function main04() {
	if (app.documents.length) {
		var docRef = app.activeDocument;
		if (docRef.layers.length) {
			var selected = getSelectedLayersIdx();
			for (var i = 0; i < selected.length; i++) {
				// var assetName = selectByIndex(selected[i]).name + ".jpg, " + "200% " + selectByIndex(selected[i]).name+ "@2x.jpg";
				var assetName = "200% " + selectByIndex(selected[i]).name+ "@2x.jpg";
				selectByIndex(selected[i]).name = assetName;
			}
		}
	}
}




//各、アクティブレイヤーのデータ取得
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

//取得データの格納、使用型に変更
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