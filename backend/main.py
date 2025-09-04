import os
from flask import Flask, render_template, request, jsonify, flash, redirect, url_for
from flask_mail import Mail, Message
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

# load .env
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
mail = Mail()

# Define Contact model
class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def __repr__(self):
        return f'<Contact {self.name}>'

def create_app():
    # Correct paths for templates and static folders
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    templates_path = os.path.join(base_dir, 'templates')
    static_path = os.path.join(base_dir, 'static')
    
    app = Flask(__name__, 
                template_folder=templates_path, 
                static_folder=static_path)

    # Config
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///contacts.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Mail config
    app.config["MAIL_SERVER"] = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    app.config["MAIL_PORT"] = int(os.getenv("MAIL_PORT", 587))
    app.config["MAIL_USE_TLS"] = os.getenv("MAIL_USE_TLS", "True") in ["True","true","1"]
    app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
    app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")
    app.config["MAIL_DEFAULT_SENDER"] = os.getenv("MAIL_USERNAME")

    RECIPIENT_EMAIL = os.getenv("RECIPIENT_EMAIL", app.config["MAIL_USERNAME"])

    # init extensions
    db.init_app(app)
    mail.init_app(app)

    # --- Website Pages ---
    @app.route("/")
    def index():
        return render_template("index.html")

    @app.route("/about")
    def about():
        return render_template("about.html")

    @app.route("/projects")
    def projects():
        return render_template("projects.html")

    @app.route("/contact", methods=["GET","POST"])
    def contact():
        if request.method == "POST":
            data = request.form
            name = (data.get("name") or "").strip()
            email = (data.get("email") or "").strip()
            message = (data.get("message") or "").strip()

            if not name or not email or not message:
                flash("All fields are required. Please try again.", "error")
                return render_template("contact.html")

            # Save to DB
            contact_entry = Contact(name=name, email=email, message=message)
            db.session.add(contact_entry)
            db.session.commit()

            # Send email
            try:
                msg = Message(subject=f"New Contact — {name}",
                              sender=app.config.get("MAIL_DEFAULT_SENDER"),
                              recipients=[RECIPIENT_EMAIL],
                              body=message)
                mail.send(msg)
                flash("Your message has been sent successfully!", "success")
            except Exception as e:
                print("Mail error:", str(e))
                flash("There was an issue sending your email. Please try again later.", "error")

            return redirect(url_for('contact'))

        return render_template("contact.html")

    return app

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True)