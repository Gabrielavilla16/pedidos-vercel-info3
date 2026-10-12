// ============================================================================
//  MISIONES — Sistema de Pedidos y Clientes · Informática III (Grupo 1301)
// ============================================================================
//  Este es el ÚNICO archivo de lógica que vas a modificar.
//
//  Cada función está "vacía" a propósito. Tu sitio publicado en Vercel tiene un
//  panel de verificación que corre casos de prueba contra estas funciones y te
//  dice cuál falla, qué esperaba y qué obtuvo. Lee el caso que falla ANTES de
//  cambiar código: así se trabaja con pruebas unitarias (lo verás en 3.4).
//
//  Puedes verificar sin publicar con:  npm run verificar
//
//  Orden recomendado: 1 → 2 → 3 → 4 → 5. La 6 es para Destacado.
// ============================================================================

import { ESTADOS } from './datos.js'

// ----------------------------------------------------------------------------
// MISIÓN 1 · RF3 — ¿Cuánto paga el cliente?
// ----------------------------------------------------------------------------
// Recibe un pedido: { items: [{ cantidad, precioUnitario }], descuento }
//   - subtotal = suma de (cantidad × precioUnitario) de cada item
//   - descuento es una fracción (0.1 = 10 %). Si no viene, es 0.
//   - total = subtotal × (1 − descuento), REDONDEADO a 2 decimales.
//   - Un pedido sin items cuesta 0.
// Pista: prueba en la consola 0.1 + 0.2 y verás por qué hay que redondear.
//        Math.round(x * 100) / 100
export function totalPedido(pedido) {
  if (!pedido || !pedido.items || pedido.items.length ===0){
return 0
  }  
const subtotal = pedido.items.reduce((acc,item)=>{
  return acc+ (item.cantidad * item.precio.Unitario)
}, 0)
const descuento =pedido.descuento || 0
const total = subtotal * (1- descuento)
return Math.round(total* 100)/100
}
------------------------------------------------------------
// MISIÓN 2 · RF4 — ¿Este cambio de estado es válido?
// ----------------------------------------------------------------------------
// Los estados avanzan en orden y SOLO un paso a la vez:
//   registrado → en_preparacion → listo → entregado
// Devuelve true únicamente si `nuevo` es el estado inmediatamente siguiente
// de `actual`. Saltar pasos, regresar o moverse desde "entregado" es false.
// Un estado que no existe también es false.
// Pista: ESTADOS ya es un arreglo ordenado. ¿Qué te dice indexOf?
export function puedeTransicionar(actual, nuevo) {
  const posActual= ESTADOS.indexOf(actual)
  const posNuevo = ESTADOS.indexOf(nuevo)
  if (posActual === -1 || posNuevo ===-1) {
    return false
  }
  return posNuevo === posActual + 1
}

// ----------------------------------------------------------------------------
// MISIÓN 3 · RF1 — ¿Los datos del cliente son válidos?
// ----------------------------------------------------------------------------
// Recibe { nombre, telefono, email } y devuelve un ARREGLO con los códigos de
// error que apliquen, en este orden. Si todo está bien, devuelve [].
//   'nombre_requerido'  → nombre vacío o solo espacios
//   'telefono_invalido' → después de quitar espacios y guiones, no son
//                         exactamente 10 dígitos
//   'email_invalido'    → el email VIENE (no está vacío) y no tiene forma de
//                         correo: algo@algo.algo   (el email es opcional)
// Pista: '55 1234-5678'.replace(/[\s-]/g, '')   y   /^\d{10}$/.test(...)
export function validarCliente(cliente) {
const errores = []
 if (!cliente) return ['nombre_requerido', 'telefono_invalido']
 const nombreLimpio = (cliente.nombre || '').trim()
  if (!nombreLimpio) {
    errores.push('nombre_requerido')
  }
  const telefonoLimpio = (cliente.telefono || '').replace(/[\s-]/g, '')
  const esTelefonoValido = /^\d{10}$/.test(telefonoLimpio)
  if (!esTelefonoValido) {
    errores.push('telefono_invalido')

}
if (cliente.email && cliente.email.trim() !== '') {
    const emailLimpio = cliente.email.trim()
    const esEmailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpio)
    if (!esEmailValido) {
      errores.push('email_invalido')
    }
  }

  return errores
}

// ----------------------------------------------------------------------------
// MISIÓN 4 · RF5 — ¿Cuántos pedidos hay en cada estado?
// ----------------------------------------------------------------------------
// Devuelve un objeto con TODOS los estados como llave, aunque tengan 0:
//   { registrado: 3, en_preparacion: 3, listo: 2, entregado: 2 }
// Con una lista vacía, todos van en 0.
export function resumenPorEstado(pedidos) {
  const resultado = {}
   ESTADOS.forEach(estado => {
    resultado[estado] = 0
  })
   if (Array.isArray(pedidos)) {
    pedidos.forEach(p => {
      if (resultado.hasOwnProperty(p.estado)) {
        resultado[p.estado]++
      }
    })
  }
  return resultado
}

// ----------------------------------------------------------------------------
// MISIÓN 5 · RF5 — Buscar pedidos por nombre de cliente
// ----------------------------------------------------------------------------
// Devuelve los pedidos cuyo cliente CONTIENE el texto buscado, sin importar
// mayúsculas ni acentos: "ramirez" encuentra a "Ana Ramírez" y "JOSÉ" a
// "José Martínez". Un texto vacío (o solo espacios) devuelve todos.
// Pista: 'Ramírez'.normalize('NFD').replace(/[̀-ͯ]/g, '')
//        Investiga qué hace NFD. Es un problema real en sistemas en español.
export function buscarPedidos(pedidos, texto) {
  if (!Array.isArray(pedidos)) return [] 
   const normalizar = (str) =>
    (str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
       const textoBuscado = normalizar(texto)

  if (!textoBuscado) {
    return pedidos
  }

  return pedidos.filter(p => {
    const clienteNombre = normalizar(p.cliente)
    return clienteNombre.includes(textoBuscado)
  })
}



// ----------------------------------------------------------------------------
// MISIÓN 6 · DESTACADO — Los mejores clientes
// ----------------------------------------------------------------------------
// Devuelve los `n` clientes que más han gastado, sumando el total de TODOS sus
// pedidos (reutiliza totalPedido, no copies la lógica).
// Formato: [{ cliente: 'Ana Ramírez', total: 1316 }, ...]
// Orden: total de mayor a menor; si empatan, por nombre alfabético.
// Pista: un objeto acumulador, luego Object.entries, map y sort.
export function topClientes(pedidos, n) {
  return [] // TODO
}
