/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import WebpackerReact from 'webpacker-react'
import React from 'react'
import ReactDOM from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import uberfetch from 'uberfetch'

class Elements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: []
    };
  }

  componentDidMount() {
    uberfetch.get(this.props.url)
      .then(res => res.json())
      .then(res => {
        this.setState({elements: res.elements});
      });
  }

  render () {
    return (
      <div>
        {this.renderElements()}
      </div>
    )
  }

  renderElements() {
    return this.state.elements.map((element, i) => {
      return <Element key={i} content={element.content} />
    })
  }
}


class Element extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showThanks: false,
      showForm: false
    };

    this.toggleForm = this.toggleForm.bind(this);
    this.noteSubmitted = this.noteSubmitted.bind(this);
  }

  render () {
    const {elementID, content, tag} = this.props;

    return (
      <div>
        <span className={`note_button note_button_${tag}`} id={`note_button_${elementID}`}>
          <a onClick={this.toggleForm}>+ 0 notes</a>
        </span>
        <div dangerouslySetInnerHTML={{__html: content}}>
        </div>
        {this.renderThanks()}
        {this.renderForm()}
      </div>
    )
  }

  toggleForm() {
    this.setState({showThanks: false, showForm: !this.state.showForm});
  }

  noteSubmitted() {
    this.toggleForm();
    this.setState({showThanks: true})
  }

  renderForm() {
    if (!this.state.showForm) { return }
    return <NoteForm noteSubmitted={this.noteSubmitted} url={this.props.url} elementID={this.props.elementID} />
  }

  renderThanks() {
    if (!this.state.showThanks) { return }
    return (
      <div className='thanks show'>Thank you for submitting a note!</div>
    )
  }
}

class NoteForm extends React.Component {
  constructor(props) {
    super(props);

    this.commentChanged = this.commentChanged.bind(this);
    this.submit = this.submit.bind(this);
  }

  commentChanged(e) {
    this.setState({comment: e.target.value});
  }

  submit(event) {
    uberfetch.post(this.props.url, {body: {note: {comment: this.state.comment}}})
      .then(res => {
        if (res.ok) {
          this.props.noteSubmitted();
        }

      })
    event.preventDefault();
  }

  render () {
    const elementID = this.props.elementID
    return (
      <form className="simple_form" onSubmit={this.submit}>
        <p>
          <label htmlFor={`element_${elementID}_note`}>Leave a note (Markdown enabled)</label>
          <textarea className='text required form-control' id={`element_${elementID}_note`} onChange={this.commentChanged}>

          </textarea>
        </p>
        <p>
          <input type="submit" name="commit" value="Leave Note" className="btn btn-primary" />
        </p>
      </form>
    )
  }
}

WebpackerReact.register(Elements)