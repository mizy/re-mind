
const getAllCommands = (remind)=>{
    const isValid = ()=>{
        if (remind.note.status === "show") {
            return false;
        }
        if(!remind.page.current) {
            return false
        }
        if (remind.page.editing) {
            return false;
        }
        if (remind.options.readonly) {
            return false;
        } 
        return true;
    }
    return [
    {
        name:"InsertSibling",
        keys:[{ keyCode: 13 }],
        prevent:true,
        isValid:()=>{
            return isValid() && !remind.options.readonly
        },
        execute : function () {
            const item = remind.page.current;
            if (item.isRoot()) {
                remind.action.execute('InsertNewItem',item, item.children.length);
            } else {
                var parent = item.parent;
                var index = parent.children.indexOf(item);
                remind.action.execute("InsertNewItem",parent, index + 1);
            }
        
            if(remind.options.autoEdit){
                remind.command.execute("Edit")
            }
        }
    },
    {
        name:'InsertChild',
        isValid,
        prevent:true,
        keys:[
			{ keyCode: 9, ctrlKey: false },
			{ keyCode: 45 }
		],
        execute : function () {
            const item = remind.page.current;
            const action = remind.action.execute('InsertNewItem',item, item.children.length);
             
            if(remind.options.autoEdit && !action._item.data.disableEdit){
                remind.command.execute("Edit");
            }
        }

    },{
        name:"Edit",
        keys:[
			{ keyCode: 32 },
			{ keyCode: 113 }
		],
        execute : function(){
            if(remind.page.current){
                const range = document.createRange();
                range.selectNodeContents(remind.page.current.textDOM);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range)
                remind.page.current.startEdit();
            }
        }
    },{
        name:"Finish",
        keys:[{ keyCode: 13, altKey: false, ctrlKey: false, shiftKey: false }],
        execute : function(){
            const item = remind.page.current;
            item.stopEdit();
            if(!item.data.text){
                remind.action.execute('RemoveItem',item);
                remind.fire("item-change", item);
            }
            if(item.data.text === item.oldText){
                return;
            }
            remind.action.execute('SetText',item, item.data.text, item.oldText);
            remind.fire("item:change", item);
            
        }
    },{
        name:"Delete",
        keys:[{ keyCode: 46 }, { keyCode: 8 }],
        isValid:function() {
            return isValid() && !remind.page.current.isRoot();
        },
        execute:function () {
            const item = remind.page.current;
            remind.action.execute('RemoveItem',item);
        }
    },{
        name:"Center",
        keys:[{ key: 'c' }],
        execute:function () {
            (remind.page.current || remind.page.root).center()
        }
    },
    {
        name:"Save",
        keys:[
            { keyCode: "s", ctrlKey: true, shiftKey: false },
			{ keyCode: "s", metaKey: true, shiftKey: false }
        ],
        execute:function () {
            remind.fire("save")
        }
    },
    {
        name:"Undo",
        keys:[
            { keyCode: "z", ctrlKey: true, shiftKey: false },
			{ keyCode: "z", metaKey: true, shiftKey: false }
        ],
        execute:function () {
            const {history} = remind;
            history.history[history.historyIndex - 1].undo();
            history.historyIndex--;
            remind.fire("undo",history.historyIndex)
        }
    },
    {
        name:"Redo",
        keys:[
            { keyCode: "z", ctrlKey: true, shiftKey: true },
			{ keyCode: "z", metaKey: true, shiftKey: true }
        ],
        execute:function () {
            const {history} = remind;
            history.history[history.historyIndex].perform();
            history.historyIndex++;
            remind.fire("redo",history.historyIndex)
        }
    },
]
}
export default getAllCommands;