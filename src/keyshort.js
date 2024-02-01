export default class AppMenu extends HTMLElement{

constructor(){
    super()
}

connectedCallback(){
    this.render()
    }


static get styles() {
    return `

    *{
        font-family:'system-ui';
    }


    @keyframes fadeIn {
        from {
            opacity: 0;
            scale: 0.85;
        }
        to {
            opacity: 1;
            scale: 1;
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
            scale: 1;
        }
        to {
            opacity: 0;
            scale: 0.85;
        }
    }



    
    dialog {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        width: 512px;
        background-color: #fff;
        border:none;
        margin: auto;
        border-radius: 0.5rem;
        box-shadow: 0 0 10px 0 rgba(0,0,0,0.1);      
    }

 
      

        .hide {
            animation: fadeOut 0.3s !important;
        }


        dialog[open] {
            animation: fadeIn 0.3s; 
        }




  
     
 


  

div{
    display: flex;
    align-items: center;
    color:#aaa;
    padding: 0.4em;
}

    input {
        width: 90%;
        padding: 1em;
        border:none;
        background-color: transparent;
        font-size: 0.875rem;

        &:focus {
            outline: none;
        }
    }
    ul {
        position: relative;
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
    
  

    hr{
        border: 1px solid #eee;
    }
 
   




    `
}







render(){   
const  config =  this.config ?? {}

if (config.key === undefined){
    return
}

const keybind = config.key

this.innerHTML =    `
    <style>
    ${AppMenu.styles}
    </style>
    <dialog>
    <div>
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-search" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /></svg>
    <input type="text" id="run" name="run" placeholder="type a command or search">
    </div>
    <hr>
    <ul>
   <app-list></app-list>
    </ul>
    </dialog>
    `
    // focus in the first li


    window.addEventListener('keydown', (e) => {

        const isKeypress = e.ctrlKey && e.key === keybind
        if(isKeypress && this.querySelector('dialog').open !== true){
        e.preventDefault()
            this.querySelector('dialog').showModal()
        }else if (isKeypress && this.querySelector('dialog').open === true){
        e.preventDefault()
const closeModal = () =>{
    this.querySelector('dialog').classList.remove('hide')
    this.querySelector('dialog').removeEventListener('animationend', closeModal)
    this.querySelector('dialog').close()

}
            this.querySelector('dialog').setAttribute('class','hide')
        this.querySelector('dialog').addEventListener('animationend',closeModal )        
        }else if(e.code == "ArrowDown"  && this.querySelector('dialog').open === true){
            e.preventDefault()
        let li =    this.querySelectorAll('app-li')
           
        }
    }
    )


    const run = this.querySelector('#run')
    run.addEventListener('input', () => {
        const appList = this.querySelector('app-list')
        appList.setAttribute('filter', run.value)
    })

    }


}

customElements.define('app-menu', AppMenu);




class AppList extends HTMLElement{




    constructor(){
        super()
        
    }
    
    connectedCallback(){
        this.render()
        }

    static get observedAttributes() {
        return ['filter'];
      }

    attributeChangedCallback(name, oldValue, newValue) {
        this.render()
      }
    
    static get styles() {
        return `
        h2{
            font-size: 0.9rem;
            margin: 0;
            padding: 0;
            color: #999;
            padding: 0.2rem;
            margin-left: 0.5rem;
        }

        ul{
            padding: 0;
            margin: 0;

        }

        li{
            margin: 0;
            padding: 0;
            list-style-type: none;
        }
`
}

    
    render(){   
    // list of animals
    const filter = this.getAttribute('filter')
    const groups = (this.parentElement.parentElement.parentElement.config.groups) ?? []

    
    const finalList = groups.map(group => {
        const elements = group.elements.filter(element => element.name.toLocaleLowerCase().startsWith(filter ? filter.toLocaleLowerCase() : ''))
        if(elements.length > 0){
            return `
            <li>
            <h2>${group.name}</h2>
            <ul>
            ${elements.map(element =>    `<app-li name="${element.name}"></app-li>`).join('')}
            </ul>
            </li>
            `
        }
    })



    this.innerHTML = `
    <style>
    ${AppList.styles}
    </style>
        <ul>
        ${finalList.join('')}
        </ul>
     `
         

    
    }



}

customElements.define('app-list', AppList);




class AppLi extends HTMLElement{
    // get 3 atributtes name,callback,description
    constructor(){
        super()
        this.attachShadow({ mode: "open" });
    }
    connectedCallback(){
        this.render()
        }

    static get styles() {
        return `

    *{
        box-sizing: border-box;
    }


        li {
width: 100%;
padding: 0.7rem;
border-radius: 0.2rem;
 &:hover {
    background-color: #eee;
    cursor: pointer;
    border-left: 2px solid rgb(136, 238, 241);
}



&:focus {
    background-color: #eee;
    outline: none;
    cursor: pointer;
    border-left: 2px solid rgb(136, 238, 241);
}
        }
        h3 {
            margin: 0;
            padding: 0;
            font-size: 20px;
            font-weight: 400;
        }

    
        li.active {
            background-color: #eee;
            border-left: 2px solid rgb(136, 238, 241);
        }


        `

    }

    static get observedAttributes() {
        return ['class'];
      }

    attributeChangedCallback(name, oldValue, newValue) {
        this.render()
      }

    render(){   
    const name = this.getAttribute('name')
    const className = this.getAttribute('class')

    this.shadowRoot.innerHTML =  ` 
        <style>
        ${AppLi.styles}
        </style>  
        <li tabindex=0 class='${className}'>
        <h3>${name}</h3>
        </li>
        `
        this.addEventListener('click',()=>{
            const groups = this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.config.groups
            const callback = groups.flatMap(group => group.elements).filter(element => element.name === name)[0].callback
            callback()
            this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.close()

        })





    }
   

    
    
}


customElements.define('app-li', AppLi);