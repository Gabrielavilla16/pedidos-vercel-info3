import { ESTADOS } from './datos.js'

// ---------------------------------------------------------------------------
// MISIÓN 1 · RF3 — ¿Cuánto paga el cliente?
// ---------------------------------------------------------------------------
export function totalPedido(pedido) {
  if (!pedido || !pedido.items || !Array.isArray(pedido.items) || pedido.items.length === 0) {
    return 0
  }

  const subtotal = pedido.items.reduce((acc, item) => {
    return acc + (Number(item.cantidad) || 0) * (Number(item.precioUnitario) || 0)
  }, 0)

  const descuento = typeof pedido.descuento === 'number' ? pedido.descuento : 0
  const total = subtotal * (1 - descuento)

  return Math.round(total * 100) / 100
}

// ---------------------------------------------------------------------------
// MISIÓN 2 · RF4 — ¿Este cambio de estado es válido?
// ---------------------------------------------------------------------------
export function puedeTransicionar(actual, nuevo) {
  if (!actual || !nuevo) return false
  const posActual = ESTADOS.indexOf(actual)
  const posNuevo = ESTADOS.indexOf(nuevo)

  if (posActual === -1 || posNuevo === -1) {
    return false
  }

  // Avanza exactamente un paso hacia adelante
  return posNuevo === posActual + 1
}

// ---------------------------------------------------------------------------
// MISIÓN 3 · RF1 — ¿Los datos del cliente son válidos?
// ---------------------------------------------------------------------------
export function validarCliente(cliente) {
  const errores = []

  if (!cliente) return ['nombre_requerido', 'telefono_invalido']

  // 1. Validar nombre
  const nombreLimpio = (cliente.nombre || '').trim()
  if (!nombreLimpio) {
    errores.push('nombre_requerido')
  }

  // 2. Validar teléfono (exactamente 10 dígitos tras limpiar espacios y guiones)
  const telefonoLimpio = (cliente.telefono || '').replace(/[\s-]/g, '')
  if (!/^\d{10}$/.test(telefonoLimpio)) {
    errores.push('telefono_invalido')
  }

  // 3. Validar email (opcional, pero si viene con texto debe tener formato válido)
  if (cliente.email !== undefined && cliente.email !== null && cliente.email.trim() !== '') {
    const emailLimpio = cliente.email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpio)) {
      errores.push('email_invalido')
    }
  }

  return errores
}

// ---------------------------------------------------------------------------
// MISIÓN 4 · RF5 — ¿Cuántos pedidos hay en cada estado?
// ---------------------------------------------------------------------------
export function resumenPorEstado(pedidos) {
  const resultado = {}
  ESTADOS.forEach(estado => {
    resultado[estado] = 0
  })

  if (Array.isArray(pedidos)) {
    pedidos.forEach(p => {
      if (p && p.estado && resultado.hasOwnProperty(p.estado)) {
        resultado[p.estado]++
      }
    })
  }

  return resultado
}

// ---------------------------------------------------------------------------
// MISIÓN 5 · RF5 — Buscar pedidos por nombre de cliente
// ---------------------------------------------------------------------------
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
    if (!p || !p.cliente) return false
    const clienteNombre = normalizar(p.cliente)
    return clienteNombre.includes(textoBuscado)
  })
}

// ---------------------------------------------------------------------------
// MISIÓN 6 · DESTACADO — Los mejores clientes
// ---------------------------------------------------------------------------
export function topClientes(pedidos, n) {
  if (!Array.isArray(pedidos) || pedidos.length === 0) return []

  const acumulado = {}
  pedidos.forEach(p => {
    if (!p || !p.cliente) return
    const cliente = p.cliente
    const total = totalPedido(p)
    acumulado[cliente] = (acumulado[cliente] || 0) + total
  })

  const lista = Object.keys(acumulado).map(cliente => ({
    cliente,
    total: Math.round(acumulado[cliente] * 100) / 100
  }))

  lista.sort((a, b) => {
    if (b.total !== a.total) {
      return b.total - a.total
    }
    return a.cliente.localeCompare(b.cliente)
  })

  return lista.slice(0, n)
}