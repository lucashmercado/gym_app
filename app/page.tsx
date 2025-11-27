import Link from 'next/link'

export default function LandingPage() {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link href="/" className="navbar-brand fw-bold">
            Gym Manager
          </Link>
          <Link href="/login" className="btn btn-primary">
            Iniciar Sesión
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <div className="container text-center py-5">
          <h1 className="display-4 fw-bold mb-3">Gestión de Gimnasios Simplificada</h1>
          <p className="lead mb-4">La plataforma todo en uno para profesores y estudiantes.</p>
          <Link href="/login" className="btn btn-light btn-lg">
            Comenzar Ahora
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">Características</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Para Profesores</h5>
                  <p className="card-text">
                    Gestiona estudiantes, crea rutinas personalizadas y monitorea el progreso.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Para Estudiantes</h5>
                  <p className="card-text">
                    Accede a tu plan de entrenamiento, registra tus avances y mantente motivado.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Seguimiento en Tiempo Real</h5>
                  <p className="card-text">
                    Visualiza estadísticas y mejoras día a día.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-5">Estadísticas</h2>
          <div className="row text-center">
            <div className="col-md-4 mb-3">
              <h3 className="display-6 fw-bold text-primary">+1000</h3>
              <p className="text-muted">Estudiantes Activos</p>
            </div>
            <div className="col-md-4 mb-3">
              <h3 className="display-6 fw-bold text-primary">+50</h3>
              <p className="text-muted">Gimnasios Asociados</p>
            </div>
            <div className="col-md-4 mb-3">
              <h3 className="display-6 fw-bold text-primary">98%</h3>
              <p className="text-muted">Satisfacción</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-4">
        <div className="container">
          <p className="mb-0">&copy; 2024 Gym Manager. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
