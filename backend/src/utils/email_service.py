import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from .config import get_settings

class EmailService:
    def __init__(self):
        self.settings = get_settings()
        self.smtp_server = self.settings.smtp_server
        self.smtp_port = self.settings.smtp_port
        self.smtp_username = self.settings.smtp_username
        self.smtp_password = self.settings.smtp_password
        self.admin_email = self.settings.admin_email

    async def send_report_notification(self, report_data: dict):
        subject = f"New Report Submitted: {report_data.get('report_id')}"
        body = f"""
        A new report has been submitted.\n
        Report ID: {report_data.get('report_id')}\n
        Content ID: {report_data.get('content_id')}\n
        Type: {report_data.get('content_type')}\n
        Report Type: {report_data.get('report_type')}\n
        Priority: {report_data.get('priority')}\n
        Reporter: {report_data.get('reporter_name')} ({report_data.get('reporter_email')})\n
        Additional Info: {report_data.get('additional_info')}\n
        Evidence: {', '.join(report_data.get('evidence', []))}\n
        """
        msg = MIMEMultipart()
        msg['From'] = self.admin_email
        msg['To'] = self.admin_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))
        try:
            await aiosmtplib.send(
                message=msg,
                hostname=self.smtp_server,
                port=self.smtp_port,
                username=self.smtp_username,
                password=self.smtp_password,
                start_tls=True,
            )
        except Exception as e:
            print(f"Failed to send email: {e}")
