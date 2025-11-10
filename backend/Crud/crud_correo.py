import smtplib
from email.mime.text import MimeText
from email.mime.multipart import MimeMultipart
from sqlalchemy.orm import Session
from .. import models, schemas
import os
from typing import Dict, Any
import json

def obtener_datos_boleta_para_correo(db: Session, boleta_id: int) -> Dict[str, Any]:
    """
    Obtener los datos de la boleta para que el frontend genere el HTML
    """
    boleta = db.query(
        models.Boleta,
        models.Cliente.nombre_razon,
        models.Cliente.rut,
        models.Cliente.email_contacto
    ).join(
        models.Cliente, models.Boleta.id_cliente == models.Cliente.id_cliente
    ).filter(
        models.Boleta.id_boleta == boleta_id
    ).first()
    
    if not boleta:
        raise ValueError("Boleta no encontrada")
    
    # Retornar datos estructurados para el frontend
    return {
        "boleta_id": boleta.Boleta.id_boleta,
        "cliente": {
            "nombre_razon": boleta.nombre_razon,
            "rut": boleta.rut,
            "email": boleta.email_contacto
        },
        "periodo": {
            "anio": boleta.Boleta.anio,
            "mes": boleta.Boleta.mes
        },
        "detalles": {
            "kwh_total": float(boleta.Boleta.kwh_total),
            "tarifa_base": float(boleta.Boleta.tarifa_base),
            "cargos": float(boleta.Boleta.cargos or 0),
            "iva": float(boleta.Boleta.iva),
            "total_pagar": float(boleta.Boleta.total_pagar)
        },
        "estado": boleta.Boleta.estado,
        "fecha_emision": boleta.Boleta.created_at.isoformat()
    }

def enviar_correo_con_html(external_html: str, email_destino: str, asunto: str) -> bool:
    """
    Enviar correo con HTML generado desde el frontend
    """
    try:
        # Configuración SMTP (usar variables de entorno)
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_user = os.getenv("SMTP_USER", "tu_email@gmail.com")
        smtp_password = os.getenv("SMTP_PASSWORD", "tu_password")
        
        # Crear mensaje
        mensaje = MimeMultipart()
        mensaje["From"] = smtp_user
        mensaje["To"] = email_destino
        mensaje["Subject"] = asunto
        
        # Adjuntar HTML proporcionado por el frontend
        mensaje.attach(MimeText(external_html, "html"))
        
        # Enviar correo
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(mensaje)
        
        return True
        
    except Exception as e:
        print(f"Error enviando correo: {str(e)}")
        return False

# Versión simulada para desarrollo
def enviar_correo_con_html_simulado(external_html: str, email_destino: str, asunto: str) -> bool:
    """
    Versión simulada para desarrollo
    """
    print(f"SIMULACIÓN: Enviando correo a {email_destino}")
    print(f"Asunto: {asunto}")
    print(f"HTML recibido (primeros 200 chars): {external_html[:200]}...")
    print("Correo enviado exitosamente (simulación)")
    return True