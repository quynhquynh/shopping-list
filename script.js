const addBtn = document.getElementById("addBtn")
const todoList = document.getElementById("todo")
const doneList = document.getElementById("done")

const itemArr = [
    {name: "tomato", quantity: "2 kg"},
    {name: "wheat flour", quantity: "1 kg"},
    {name: "beef", quantity: "500g"},
    {name: "strawberry", quantity: "1.5 litre"},
    {name: "dress", quantity: 2}
]

//display item in itemArr
const display = () => {
    for (let item of itemArr){
        let line = `
            <tr>
                <td><input type="checkbox" onchange="checkEvent(event)"></td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td><button class="edit" onclick="isEditable(event)">Edit</button></td>
                <td><button class="delBtn" onclick="deleteItem(event)" ><i class="fas fa-trash-alt"></i></button></td>
            </tr>       
        `
        todoList.innerHTML += line
    }
}

display()

//add item
addBtn.onclick=(e)=>{
    e.preventDefault()
    const input = document.getElementById('name')
    const quantity = document.getElementById('quantity')
    const digitQuantity = parseFloat(quantity.value)
    const regex = /^[a-z\s]{2,}$/i
    if(regex.test(input.value)){
        if(digitQuantity>0){
            let count = 0
            for(let item of itemArr){
                if(item.name === input.value){
                    count += 1
                    if(confirm("item is already in the list. Add more?")){
                        //quantity from array contains words"
                        if(/[a-z]/i.test(item.quantity)){
                            let digit_quantity = parseFloat(item.quantity)
                            let update_quantity = digit_quantity + digitQuantity
                            let space_index = item.quantity.indexOf(" ")
                            let letters
                            (space_index<0)? 
                            letters = item.quantity.substring(/\D/g.exec(item.quantity).index) 
                            :letters = item.quantity.substring(space_index)
                            item.quantity = update_quantity + letters  
                        }else{
                            item.quantity += digitQuantity
                        }
                      
                        for(let element of todoList.children){
                            if(element.children[1].innerHTML===input.value){
                                element.children[2].innerHTML = item.quantity
                            }
                        }
                        input.value = ""
                        quantity.value = ""
                    }else{
                        input.value = ""
                        quantity.value = ""
                        return false
                    }
                }
            }
            if(count===0){
                
                itemArr.push({
                    name: input.value,
                    quantity: quantity.value
                })
                
                let line = `
                    <tr>
                        <td><input type="checkbox" onchange="checkEvent(event)"></td>
                        <td>${input.value}</td>
                        <td>${quantity.value}</td>
                        <td><button class="edit" onclick="isEditable(event)">Edit</button></td>
                        <td><button class="delBtn" onclick="deleteItem(event)" ><i class="fas fa-trash-alt"></i></button></td>
                    </tr> 
                `
                todoList.innerHTML += line
                input.value = ""
                quantity.value = ""
            }
        }else{
            alert("invalid quantity")
            quantity.value = ""
        }
    }else{
        alert("invalid input")
        input.value = ""
        return false
    }
}

//delete item
const deleteItem = e => {
    let target, tr
    if(e.target.nodeName === 'BUTTON') tr = e.target.parentNode.parentNode
    if(e.target.nodeName === 'I') tr = e.target.parentNode.parentNode.parentNode

    target = tr.children[1].innerHTML
    if (tr.parentNode == todoList) todoList.removeChild(tr)
    if (tr.parentNode == doneList) doneList.removeChild(tr)

    for(let i=0; i<itemArr.length; i++){
        if(itemArr[i].name===target){
            itemArr.splice(i, 1)
        }
    }
}

//checkbox event handler
const checkEvent = e => {
    let tr = e.target.parentNode.parentNode
    e.target.checked ? doneList.appendChild(tr) : todoList.appendChild(tr)
}


doneList.style.visibility = "hidden"
//to show/hide done list
const isToggle = (e) => {
    if (e.target.classList[1]==="fa-angle-down"){
        e.target.classList.replace("fa-angle-down", "fa-angle-up")
        doneList.style.visibility = "visible"
    } else{
        e.target.classList.replace("fa-angle-up", "fa-angle-down")
        doneList.style.visibility = "hidden"
    }
}


//to edit quantity
const isEditable = (e) => {
    const prev = e.target.parentNode.parentNode.children[2]
    prev.innerHTML = `<input type="text" class="editText">`
    e.target.parentNode.innerHTML = `<button class="save"  onclick="isSaved(event)">Save</button>`
    const edit_text = document.getElementsByClassName('editText')
    const save = document.getElementsByClassName('save')
    for(let i=0;i<edit_text.length;i++){
        edit_text[i].addEventListener("keyup", (event)=>{
            event.preventDefault()
            if(event.keyCode===13){
                save[i].click()
            }
        })
    }
}

//to save updated quantity
const isSaved = (e) => {
    const name = e.target.parentNode.parentNode.children[1].innerHTML
    let update = e.target.parentNode.parentNode.children[2].children[0].value
    if(parseInt(update, 10)>0){
        const input = e.target.parentNode.parentNode.children[2]
        input.innerHTML = `${update}`
        e.target.parentNode.innerHTML = `<button class="edit" onclick="isEditable(event)">Edit</button>`
    
        for(let item of itemArr){
            if(item.name === name){
                item.quantity = update
            }
        }
    } else {
        alert ("invalid quantity")
        e.target.parentNode.parentNode.children[2].innerHTML = `<input type="text" placeholder=${update}>`
        return false
    }
    
}


