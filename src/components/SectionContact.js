import React, { useState } from "react";
import _ from "lodash";

import { htmlToReact, markdownify } from "../utils";
import FormField from "./FormField";
import emailjs from "emailjs-com";

const isEmailValid = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const SectionContact = (props) => {
    const emailjsKey = "user_nhVBkJKWL8i5wQRy2y9Uj";

    const [buttonText, setButtonText] = useState("Send Message");
    const [onError, setOnError] = useState(false);

    const onSubmit = (e) => {
        let formValid = true;
        setOnError(false);
        e.preventDefault();

        const form = document.forms[0];
        const name = form.elements["name"].value;
        const email = form.elements["email"].value;
        const message = form.elements["message"].value;

        if (!name) {
            formValid = false;
        }

        if (!email || !isEmailValid(email)) {
            formValid = false;
        }

        if (!message) {
            formValid = false;
        }

        if (!formValid) {
            setButtonText("Please fill the fields!");
            setOnError(true);
        } else {
            emailjs
                .send(
                    "sendgrid",
                    "libertas",
                    { message, from_name: name, reply_to: email },
                    emailjsKey,
                )
                .then(
                    () => {
                        setButtonText("Message Sent!");
                    },
                    (error) => {
                        console.error(error);
                        setButtonText("An Error Occurred!");
                        setOnError(true);
                    },
                );
        }
    };
    let section = _.get(props, "section", null);
    return (
        <section
            id={_.get(section, "section_id", null)}
            className={
                "block contact-block bg-" + _.get(section, "background", null) + " outer"
            }
        >
            <div className="block-header inner-small">
                {_.get(section, "title", null) && (
                    <h2 className="block-title">{_.get(section, "title", null)}</h2>
                )}
                {_.get(section, "subtitle", null) && (
                    <p className="block-subtitle">
                        {htmlToReact(_.get(section, "subtitle", null))}
                    </p>
                )}
            </div>
            <div className="block-content inner-medium">
                {markdownify(_.get(section, "content", null))}
                <form
                    name={_.get(section, "form_id", null)}
                    id={_.get(section, "form_id", null)}
                    {...(_.get(section, "form_action", null)
                        ? { action: _.get(section, "form_action", null) }
                        : null)}
                >
                    {_.map(_.get(section, "form_fields", null), (field, field_idx) => (
                        <div key={field_idx} className="form-row">
                            <FormField {...props} field={field} section={section} />
                        </div>
                    ))}
                    <div className="form-row form-submit">
                        <button
                            type="submit"
                            className="button"
                            style={{ background: onError && "red" }}
                            onClick={onSubmit}
                        >
                            {buttonText}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default SectionContact;
