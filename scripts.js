const API_URL = 'https://apis.is/company?name=';
/**
 * Leit að fyrirtækjum á Íslandi gegnum apis.is
 */
const program = (() => {
  let input;
  let results;
  function init(companies) {
    const form = companies.querySelector('form');
    input = document.querySelector('input');
    results = companies.querySelector('.results');
    form.addEventListener('submit', submit);
  }

  function submit(event) {
    event.preventDefault();
    empty(results);
    const value = input.value;
    if (value.trim() === '') {
      showMessage('Fyrirtæki verður að vera strengur');
    } else {
      getResults(value);
    }
  }

  function getResults(company) {
    removeLoadingState();
    empty(results);
    displayLoadingState();
    fetch(`${API_URL}${company}`)
      .then((result) => {
        if (!result.ok) {
          throw new Error('Non 200 status');
        }
        return result.json();
      })
      .then(data => insert(data.results))
      .catch(error => 
        {
          removeLoadingState();
          showMessage('Villa að sækja gögn');
        });   
  }

  function insert(data) {
    if (data.length === 0) {
      removeLoadingState();
      showMessage('Ekkert fannst');
    } else {
      data.forEach((item) => {
        createElements(item);
      })
    }
  }

  function showMessage(msg) {
    const text = document.createElement('div');
    text.append(document.createTextNode(msg));
    results.appendChild(text);
  }
  
  function displayLoadingState () {
    const results = document.querySelector('section');
    const img = document.createElement('img');
    const div = document.createElement('div');
    const text = document.createElement('p');
    div.setAttribute('class','load');
    div.appendChild(img);
    div.appendChild(text);
    text.append(document.createTextNode('Leita að fyrirtækjum...'));
    img.setAttribute('src','loading.gif');
    img.setAttribute('class','loading');
    results.appendChild(div);
  }

  function removeLoadingState () {
    const results = document.querySelector('section');
    if (results.querySelector('img')) {
      const img = results.querySelector('.load');
      const {parentNode} = img;
      parentNode.removeChild(img);
    }
  }

  function empty(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function createElements(data) {
    
    const div = document.createElement('div');
    const dl = document.createElement('dl');
    const dd = [];
    const dt = [];
    dt[0] = document.createElement('dt');
    dt[1] = document.createElement('dt');
    dd[0] = document.createElement('dd');
    dd[1] = document.createElement('dd');
    dt[0].append(document.createTextNode('Nafn'));
    dd[0].append(document.createTextNode(data.name));
    dt[1].append(document.createTextNode('Kennitala'));
    dd[1].append(document.createTextNode(data.sn));

    if (data.active == '1') {
      dt[2] = document.createElement('dt');
      dd[2] = document.createElement('dd');
      div.setAttribute('class','company company--active');
      dt[2].append(document.createTextNode('Heimilisfang'));
      dd[2].append(document.createTextNode(data.address));
      
    } else {
      div.setAttribute('class','company company--inactive');
      
    }
    
    dt.forEach((dt1) => {
      dl.appendChild(dt1);
    })
    dd.forEach((dd1) => {
      dl.appendChild(dd1);
    })

    div.appendChild(dl);
    results.appendChild(div);
    removeLoadingState();
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const companies = document.querySelector('section');
  program.init(companies);
})