import { Component } from "react";
import { ThemeProvider } from 'styled-components'
import { theme } from 'theme/theme';
import { nanoid } from "nanoid";
import Swal from "sweetalert2";

import { Container } from "./Container/Container";
import { MainTitle } from './Titles/MainTitle/MainTitle'
import { ContactForm } from "./ContactForm/ContactForm";
import { SecondaryTitle } from "./Titles/SecondaryTitle/SecondaryTitle";
import { Filter } from "./Filter/Filter";
import { ContactList } from "./ContactList/ContactList";

export class App extends Component{
  state = {
  contacts: [{id: 'id-1', name: 'Rosie Simpson', number: '459-12-56'},
    {id: 'id-2', name: 'Hermione Kline', number: '443-89-12'},
    {id: 'id-3', name: 'Eden Clements', number: '645-17-79'},
    {id: 'id-4', name: 'Annie Copeland', number: '227-91-26'},],
    name: '',
    number: '',
    filter: '',
  }
  
 
  componentDidMount() {
    const getData = JSON.parse(localStorage.getItem('contacts')); 
    if (getData) {
      this.setState({contacts: getData})
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.contacts !== prevState.contacts) {
          localStorage.setItem('contacts', JSON.stringify(this.state.contacts))
    }
  }

  handleSubmit = (values, { resetForm }) => {
    this.addNewContact(values)
    resetForm()
  }

  addNewContact = (values) => {
    const { name, number } = values;
    const newContact = {
      id: nanoid(),
      name,
      number
    }
      if (this.state.contacts.map((({name}) => name.toLowerCase())).includes(name.toLowerCase())) {
       Swal.fire({
  title: `${name} is already in contacts.`,
  icon: 'info',
  confirmButtonText: 'Okay'
         })
      } else {
        this.setState(prevState => ({
      contacts: [newContact, ...prevState.contacts]
    }  
    ))
    }
  }

  handleFilter = (e) => {
    this.setState({ filter: e.currentTarget.value })
    this.renderFilterList()
  }

  renderFilterList = () => {
    const { contacts, filter } = this.state;
       return contacts
        .map(contact => contact)
        .filter(({name}) => name.toLowerCase().includes(filter.toLowerCase()))
  }

  deleteContact = (id) => {
    this.setState(({contacts}) => ({
      contacts: contacts.filter((contact => contact.id !== id)),
   }))
 }

  render() {
    const { name, number, contacts} = this.state
    const filterList = this.renderFilterList();

    return <ThemeProvider theme={theme}>
      <Container display="flex" flexDirection="column" alignItems="center" padding="3">
        <MainTitle title='Phonebook' />
        <ContactForm name={name} number={number} getData={this.handleSubmit}/>
        <SecondaryTitle title='Contacts' />
        <Filter title='Find contacts by name' handleFilter={this.handleFilter} />
        <ContactList filterContacts={filterList} contacts={contacts} deleteContact={this.deleteContact}/>
      </Container>
      </ThemeProvider>
  }
}

