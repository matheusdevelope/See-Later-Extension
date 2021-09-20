document.addEventListener("DOMContentLoaded", function () {
    const ListaLocal = localStorage.getItem("ListaItem")
    const ListaExcludesLocal = localStorage.getItem("ListaExcludes")
    const ListaNavigationLocal = localStorage.getItem("ListaNavigation")

    let ListaItem = ListaLocal != null ? JSON.parse(ListaLocal) : []
    let ListaExcludes = ListaExcludesLocal != null ? JSON.parse(ListaExcludesLocal) : []
    let ListaNavigation = ListaNavigationLocal != null ? JSON.parse(ListaNavigationLocal) : []
    let ItemEdit = { ID: '', TitleItem: '', URL: '', Icon: 'images/icon.png' }
    let ID = GetIdLocalStorage()
    
    function GetIdLocalStorage() {
        const ID = localStorage.getItem("IdSeeLater")
        if (ID == null) {
            localStorage.setItem('IdSeeLater', '1')
            return '1'
        }
        return ID
    }
    function SetIdLocalStorage(id) {
        localStorage.setItem('IdSeeLater', JSON.stringify(id))
        ID = id
    }
    function SetListLocalStorage(adress, list) {
        localStorage.setItem(adress, JSON.stringify(list))
    }
    function GetDataPage() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            ItemEdit.TitleItem = tabs[0].title
            ItemEdit.URL = tabs[0].url
            ItemEdit.Icon = tabs[0].favIconUrl
            if (tabs[0].favIconUrl == '' | tabs[0].favIconUrl == undefined | tabs[0].favIconUrl == null) {
                ItemEdit.Icon = 'images/icon.png'
            }
            InputNewItem()
        });
    }

    function InputNewItem() {
        let InsertNewItem = document.querySelector("#InsertNewItem");
        InsertNewItem.innerHTML = "";
        const TitleItem = (ItemEdit.TitleItem)
        const URL = ItemEdit.URL;
        const Icon = ItemEdit.Icon;
        const Item =
            `<div class="ItemLista" ItemID="${ID}">
            <img href="#" class="Icon" src='${Icon}'/>
                <div class='BoxInputs'>
                    <input class="TitleItem" placeholder="Insira o Titulo." type="text" value="${TitleItem}"/>
                    <input class="URL" placeholder="Insira a URL:" type="text" value="${URL}"/>
                </div>
                <div class="Buttons">
                <div class="Button">
                   <img href="#" class="Save" src='images/ok 2.png'/>
                   </div>
                   </div>
            </div>`;
        InsertNewItem.innerHTML += Item;
        SaveNewItem()
    }

    function SaveNewItem() {
        document.querySelectorAll("#InsertNewItem  .Save").forEach((el, i) => {
            el.addEventListener("click", () => {
                const ID = el.parentElement.parentElement.parentElement.getAttribute("ItemID");
                const TitleItem = el.parentElement.parentElement.parentElement.querySelector(".TitleItem").value;
                const URL = el.parentElement.parentElement.parentElement.querySelector(".URL").value;
                const Icon = el.parentElement.parentElement.parentElement.querySelector(".Icon").src;
                if (!TitleItem.length || !URL.length) {
                    alert("É necessário um título e uma URL para salvar.");
                    return false;
                }
                ListaItem.push({ ID: ID, TitleItem: TitleItem, URL: URL, Icon: Icon });
                const id = Number(ID) + 1
                SetIdLocalStorage(id)
                // alert(ListaItem)
                ItemEdit = { ID: '', TitleItem: '', URL: '', Icon: 'images/icon.png' }
                SetListLocalStorage("ListaItem", ListaItem)
                InputNewItem()
                LoadItem()
            });
        });
    }
    function Remove() {
        document.querySelectorAll("#ItensList .Delete").forEach((el, i) => {
            el.addEventListener("click", () => {
                ListaItem.splice(i, 1);
                SetListLocalStorage("ListaItem", ListaItem)
                LoadItem()
                ListaExcludes.push(ListaItem[i])
                SetListLocalStorage("ListaExcludes", ListaExcludes)
            });
        })
    }
    function Navigate() {
        document.querySelectorAll("#ItensList .GoToSite").forEach((el, i) => {
            el.addEventListener("click", () => {
                // const url = el.parentElement.parentElement.parentElement.querySelector(".ID").value
                window.open(ListaItem[i].URL, '_blank').focus();
                LoadItem()
                ListaNavigation.push(ListaItem[i])
                SetListLocalStorage("ListaNavigation", ListaNavigation)
            });
        })
    }

    function LoadItem() {
        let data = document.querySelector("#ItensList");
        data.innerHTML = "";
        ListaItem.forEach((el) => {
            const ID = el.ID;
            const TitleItem = el.TitleItem;
            const URL = el.URL;
            const Icon = el.Icon;
            const Item =
                `<div class="ItemLista" ItemID="${ID}">
                <img href="#" class="Icon" src='${Icon}'/>
                <div class='BoxInputs'>
                
                    <textarea class="TitleItem" placeholder="Insira o Titulo" rows="5"  cols="30" type="text" value="${TitleItem}">${TitleItem}</textarea>
                   
                    </div>    
                    <div class="Buttons">
                    <div class='Button'>
                            <img  href="#" class="GoToSite" src='images/go.png'/>
                    </div>
                    <div class='Button'>
                            <img href="#" class="Delete" src='images/delete.png'/>
                    </div>
                        </div>
                </div>`;
            data.innerHTML += Item;
        })
        Navigate()
        Remove()
    }
    // function Atalho(tabs) {
    //     // alert("ATALHO 11")
    //     document.addEventListener('keydown', function (e) {
    //         // This would be triggered by pressing CTRL + A
    //         // alert("ATALHO")
    //         if (e.key == 's' && e.altKey) {
    //             alert("ATALHO2")
    //         }

    //         // Or with ALT + A
    //         //if (e.altKey && e.keyCode == 65) {
    //         //    window.location.href = "http://ourcodeworld.com"; 
    //         //}
    //     });
    // }
    // Atalho()

    GetDataPage()
    LoadItem()
})
