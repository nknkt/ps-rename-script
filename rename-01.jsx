/*================================================================================
#	LayerRenamer for Photoshop
#	レイヤーのリネームツール
================================================================================*/

#target photoshop

//================================================================================
const SCRIPT_TITLE = "LayerRenamer";
const STATIC_TEXT_MIN_WIDTH = 60;
const EDIT_TEXT_MIN_WIDTH = 100;
const EDIT_TEXT_MIN_HEIGHT = 30;

//================================================================================
// 実行部
app.activeDocument.suspendHistory("LayerRenamer","Run()");

//================================================================================
// メイン処理
function Run() {
    
    Init();
    
    // リネーム方式が変更されたら
    grpRenameType.selectType.onChange = function () {
        HideSelectType();
        switch (grpRenameType.selectType.selection.text) {
        case "Replace":
            pnlSelectReplace.show();
            break;
        case "SerialNum":
            pnlSelectSerialNum.show();
            break;
        case "Delete":
            pnlSelectDelete.show();
            break;
        case "Add":
        default:
            pnlSelectAdd.show();
            break;
        }
        refresh();
    }

    // 実行ボタンが押されたら
    grpSystemButton.btnApply.onClick = function () {
        Rename();
    }

    dlg.show();
}

//================================================================================
// 初期化処理
function Init() {
    SettingWindow();
    
    grpRenameType.selectType.selection = 0;
    grpSelectLayer.target.selection = 0;
    
    pnlSelectAdd.show();
}

//================================================================================
// ウィンドウの設定
function SettingWindow () {
    
    // --ウィンドウの生成
    dlg = new Window ("dialog", SCRIPT_TITLE);
    dlg.margins = [10, 10, 10, 10];
    
    // --Panel > Setting
    dlg.pnlSetting = dlg.add("panel", undefined,"Setting");
    dlg.pnlSetting.alignment = "left";
    
    // --Rename
    grpRenameType = dlg.pnlSetting.add("group");
    grpRenameType.alignment = "fill";
    grpRenameType.sText = grpRenameType.add("statictext", undefined, "リネーム方法を選択：");
    grpRenameType.selectType = grpRenameType.add("dropdownlist", undefined, ["Add", "Replace", "SerialNum", "Delete"]);

    // --SelectLayer
    grpSelectLayer = dlg.pnlSetting.add("group");
    grpSelectLayer.alignment = "fill";
    grpSelectLayer.sText = grpSelectLayer.add("statictext", undefined, "対象レイヤーを選択：");
    grpSelectLayer.target = grpSelectLayer.add("dropdownlist", undefined, ["All Layers", "Select Layers"]);

    // --Option
    grpOption = dlg.pnlSetting.add("group");
    grpOption.alignment = "fill";
    grpOption.orientation = "stack";

    //================================================================================
    // -- Option > pnlSelectAdd
    pnlSelectAdd = grpOption.add("panel", undefined, "Add - Option");
    pnlSelectAdd.alignment = "fill";

    // -- Option > pnlSelectAdd > AddPosition
    grpAddPos = pnlSelectAdd.add("group");
    grpAddPos.alignment = "left";
    grpAddPos.sText = grpAddPos.add("statictext", undefined, "前後(Pre/Suf):");
    grpAddPos.sText.minimumSize = [STATIC_TEXT_MIN_WIDTH, undefined];
    grpAddPos.position = grpAddPos.add("dropdownlist", undefined, ["Prefix", "Suffix"]);
    
    // -- Option > pnlSelectAdd > AddDigit
    grpAddDigit = pnlSelectAdd.add("group");
    grpAddDigit.alignment = "left";
    grpAddDigit.sText = grpAddDigit.add("statictext", undefined, "何桁目:");
    grpAddDigit.sText.alignment = "left";
    grpAddDigit.sText.minimumSize = [STATIC_TEXT_MIN_WIDTH, undefined];
    grpAddDigit.eText = grpAddDigit.add("edittext", undefined, "0");
    grpAddDigit.eText.minimumSize = [EDIT_TEXT_MIN_WIDTH, undefined];    
    
    // -- Option > pnlSelectAdd > AddText
    grpAddText = pnlSelectAdd.add("group");
    grpAddText.alignment = "left";
    grpAddText.sText = grpAddText.add("statictext", undefined, "追加文字:");
    grpAddText.sText.alignment = "left";
    grpAddText.sText.minimumSize = [STATIC_TEXT_MIN_WIDTH, undefined];
    grpAddText.eText = grpAddText.add("edittext", undefined, "");
    grpAddText.eText.alignment = "left";
    grpAddText.eText.minimumSize = [EDIT_TEXT_MIN_WIDTH, undefined];
    
    //================================================================================
    // -- Option > pnlSelectReplace
    pnlSelectReplace = grpOption.add("panel", undefined, "Replace - Option");
    pnlSelectReplace.alignment = "fill";
    
    // -- Option > pnlSelectReplace > ReplaceBefore
    grpReplaceBefore = pnlSelectReplace.add("group");
    grpReplaceBefore.alignment = "left";
    grpReplaceBefore.sText = grpReplaceBefore.add("statictext", undefined, "置換前：");
    grpReplaceBefore.sText.minimumSize = [STATIC_TEXT_MIN_WIDTH, undefined];
    grpReplaceBefore.eText = grpReplaceBefore.add("edittext", undefined, "");
    grpReplaceBefore.eText.minimumSize = [EDIT_TEXT_MIN_WIDTH, undefined];

    // -- Option > pnlSelectReplace > ReplaceAfter
    grpReplaceAfter = pnlSelectReplace.add("group");
    grpReplaceAfter.alignment = "left";
    grpReplaceAfter.sText = grpReplaceAfter.add("statictext", undefined, "置換後：");
    grpReplaceAfter.sText.minimumSize = [STATIC_TEXT_MIN_WIDTH, undefined];
    grpReplaceAfter.eText = grpReplaceAfter.add("edittext", undefined, "");
    grpReplaceAfter.eText.minimumSize = [EDIT_TEXT_MIN_WIDTH, undefined];

    //================================================================================
    // -- Option > pnlSelectSerialNum
    pnlSelectSerialNum = grpOption.add("panel", undefined, "SerialNum - Option");
    pnlSelectSerialNum.alignment = "fill";
    
    // -- Option > pnlSelectSerialNum > OverwriteCheck
    grpSerialNumOverwriteCheck = pnlSelectSerialNum.add("group");
    grpSerialNumOverwriteCheck.alignment = "left";
    grpSerialNumOverwriteCheck.cBox = grpSerialNumOverwriteCheck.add("checkbox", undefined, "：上書き");
    
    // -- Option > pnlSelectSerialNum > OverwriteText
    grpSerialNumOverwriteText = pnlSelectSerialNum.add("group");
    grpSerialNumOverwriteText.alignment = "left";
    grpSerialNumOverwriteText.sText = grpSerialNumOverwriteText.add("statictext", undefined, "上書き文字：");
    grpSerialNumOverwriteText.sText.minimumSize = [STATIC_TEXT_MIN_WIDTH, undefined];
    grpSerialNumOverwriteText.eText = grpSerialNumOverwriteText.add("edittext", undefined, "");
    grpSerialNumOverwriteText.eText.minimumSize = [EDIT_TEXT_MIN_WIDTH, undefined];
    
    // -- Option > pnlSelectSerialNum > SerialNumPos
    grpSerialNumPos = pnlSelectSerialNum.add("group");
    grpSerialNumPos.alignment = "left";
    grpSerialNumPos.sText = grpSerialNumPos.add("statictext", undefined, "前後(Pre/Suf):");
    grpSerialNumPos.sText.minimumSize = [STATIC_TEXT_MIN_WIDTH, undefined];
    grpSerialNumPos.position = grpSerialNumPos.add("dropdownlist", undefined, ["Prefix", "Suffix"]);    
    
    // -- Option > pnlSelectSerialNum > SerialNumStartNum
    grpSerialNumStartNum = pnlSelectSerialNum.add("group");
    grpSerialNumStartNum.alignment = "left";
    grpSerialNumStartNum.sText = grpSerialNumStartNum.add("statictext", undefined, "開始数：");
    grpSerialNumStartNum.sText.minimumSize = [STATIC_TEXT_MIN_WIDTH, undefined];
    grpSerialNumStartNum.eText = grpSerialNumStartNum.add("edittext", undefined, "1");
    grpSerialNumStartNum.eText.minimumSize = [EDIT_TEXT_MIN_WIDTH, undefined];
    
    // -- Option > pnlSelectSerialNum > SerialNumDigit
    grpSerialNumDigit = pnlSelectSerialNum.add("group");
    grpSerialNumDigit.alignment = "left";
    grpSerialNumDigit.sText = grpSerialNumDigit.add("statictext", undefined, "桁数：");
    grpSerialNumDigit.sText.minimumSize = [STATIC_TEXT_MIN_WIDTH, undefined];
    grpSerialNumDigit.eText = grpSerialNumDigit.add("edittext", undefined, "1");
    grpSerialNumDigit.eText.minimumSize = [EDIT_TEXT_MIN_WIDTH, undefined];
    
    //================================================================================
    // -- Option > pnlSelectDelete
    pnlSelectDelete = grpOption.add("panel", undefined, "Delete - Option");
    pnlSelectDelete.alignment = "fill";

    // -- Option > pnlSelectDelete > DeletePos
    grpDeletePos = pnlSelectDelete.add("group");
    grpDeletePos.alignment = "left";
    grpDeletePos.sText = grpDeletePos.add("statictext", undefined, "前後(Pre/Suf):");
    grpDeletePos.sText.minimumSize = [STATIC_TEXT_MIN_WIDTH, undefined];
    grpDeletePos.position = grpDeletePos.add("dropdownlist", undefined, ["Prefix", "Suffix"]);
    
    // -- Option > pnlSelectDelete > DeleteDigit
    grpDeleteDigit = pnlSelectDelete.add("group");
    grpDeleteDigit.alignment = "left";
    grpDeleteDigit.sText = grpDeleteDigit.add("statictext", undefined, "桁数：");
    grpDeleteDigit.sText.minimumSize = [STATIC_TEXT_MIN_WIDTH, undefined];
    grpDeleteDigit.eText = grpDeleteDigit.add("edittext", undefined, "1");
    grpDeleteDigit.eText.minimumSize = [EDIT_TEXT_MIN_WIDTH, undefined];

    //================================================================================
    // --システムボタン
    grpSystemButton = dlg.add("group");
    grpSystemButton.btnApply = grpSystemButton.add("button",undefined, "実行", { name:"apply"});
    grpSystemButton.btnCancel = grpSystemButton.add("button",undefined, "閉じる", { name:"cancel"});
    grpSystemButton.btnCancel.minimumSize = [100, 30];
    
    HideSelectType();
}

//================================================================================
// 各リネーム処理の反映処理
function Rename() {
    var selectType = grpRenameType.selectType.selection.text;
    var targetLayerList = [];
    
    // 対象レイヤーの設定
    if (grpSelectLayer.target.selection.text == "All Layers") {
        targetLayerList = activeDocument.layers;
    } else {
        GetSelectedLayers(targetLayerList);
    }
    
    // リネーム方式の設定
    switch (selectType) {
        case "Add":
            RenameAdd(targetLayerList);
            break;
        case "Replace":
            RenameReplace(targetLayerList);
            break;
        case "SerialNum":
			RenameSerialNum(targetLayerList);
            break;
        case "Delete":
			RenameDelete(targetLayerList);
            break;
    }

    alert("リネームが完了しました。", "完了通知");
}

//================================================================================
// 追加の処理
function RenameAdd(targetList) {
    var insertNum = parseInt(grpAddDigit.eText.text);
    var addText = grpAddText.eText.text;
    
    for (var i = 0; i < targetList.length; i++) {
        var layerName = targetList[i].name;
        var layerVisible = targetList[i].visible;
        
        if (grpAddPos.position.selection.text == "Prefix") {
            targetList[i].name = StringInsert(layerName, insertNum, addText);
        } else {
            targetList[i].name = StringInsert(layerName, (layerName.length - insertNum), addText);
        }
        targetList[i].visible = layerVisible;
    }
}

//================================================================================
// 置換の処理
function RenameReplace(targetList) {
    var beforeText = grpReplaceBefore.eText.text;
    var afterText = grpReplaceAfter.eText.text;
    
    for (var i = 0; i < targetList.length; i++) {
        targetList[i].name = targetList[i].name.replace (beforeText, afterText);
    }
}

//================================================================================
// 連番の処理
function RenameSerialNum(targetList) {
	var serialNumCount =  parseInt(grpSerialNumStartNum.eText.text);
	var digit = parseInt(grpSerialNumDigit.eText.text);
	var overWriteName = grpSerialNumOverwriteText.eText.text;
		
    for (var i = 0; i < targetList.length; i++) {
		var name = targetList[i].name;
		var num = ZeroPadding(serialNumCount, digit);

		/* 上書きする？ */
		if (grpSerialNumOverwriteCheck.cBox.value) {
			name = overWriteName;
		}
		
		if (grpSerialNumPos.position.selection.text == "Prefix") {
			name = num + name;
		} else {
			name = name + num;
		}
		
		targetList[i].name = name;
		
		serialNumCount++;
	}
}

//================================================================================
// 削除の処理
function RenameDelete(targetList) {
	var digit = parseInt(grpDeleteDigit.eText.text);
	
    for (var i = 0; i < targetList.length; i++) {
		var name = targetList[i].name;
		var res = "";
		
		if (grpDeletePos.position.selection.text == "Prefix") {
			res = name.substr(name.length - digit, name.length);
			name = res;
		} else {
			res = name.substr(0, name.length - digit);
			name = res;
		}

		targetList[i].name = name;
	}
}

//================================================================================
// パネルを全て非表示
function HideSelectType() {
    pnlSelectAdd.hide();
    pnlSelectReplace.hide();
    pnlSelectSerialNum.hide();
    pnlSelectDelete.hide();
}

//================================================================================
// 選択レイヤーを取得
function GetSelectedLayers(targetLayerList) {
	var idGrp = stringIDToTypeID( "groupLayersEvent" );
	var descGrp = new ActionDescriptor();
	var refGrp = new ActionReference();
	refGrp.putEnumerated(charIDToTypeID( "Lyr " ),charIDToTypeID( "Ordn" ),charIDToTypeID( "Trgt" ));
	descGrp.putReference(charIDToTypeID( "null" ), refGrp );
	executeAction( idGrp, descGrp, DialogModes.ALL );

    for (var i = 0; i < app.activeDocument.activeLayer.layers.length; i++) {
        targetLayerList.push(app.activeDocument.activeLayer.layers[i])
    }

    Undo();
}

//================================================================================
// Undo処理
function Undo() {
	executeAction(charIDToTypeID("undo"), undefined, DialogModes.NO);
}

//================================================================================
// 文字列のインサート処理
function StringInsert(strBefore, idx, strAdd) {
    return (strBefore.slice(0, idx) + strAdd + strBefore.slice(idx));
}

//================================================================================
// 数値の桁数ゼロ埋め処理
function ZeroPadding(number, digit) {
	var numberLength = String(number).length;
    if (digit > numberLength) {
        return (new Array((digit - numberLength) + 1).join(0)) + number;
    } else {
        return number;
    }
}