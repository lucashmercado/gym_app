# Script para actualizar layout de todas las páginas del dashboard

$files = @(
    "app/dashboard/student/progress/page.tsx",
    "app/dashboard/professor/templates/[id]/assign/page.tsx",
    "app/dashboard/professor/templates/page.tsx",
    "app/dashboard/professor/templates/new/page.tsx",
    "app/dashboard/professor/students/[id]/page.tsx",
    "app/dashboard/professor/students/page.tsx",
    "app/dashboard/professor/students/new/page.tsx",
    "app/dashboard/professor/plans/page.tsx",
    "app/dashboard/professor/plans/[id]/page.tsx",
    "app/dashboard/professor/plans/new/page.tsx",
    "app/dashboard/professor/plans/[id]/edit/page.tsx",
    "app/dashboard/professor/payments/new/page.tsx",
    "app/dashboard/professor/payments/page.tsx",
    "app/dashboard/professor/exercises/page.tsx",
    "app/dashboard/professor/exercises/new/page.tsx"
)

foreach ($file in $files) {
    $fullPath = "c:\Users\54116\.gemini\antigravity\scratch\gym_system\$file"
    
    if (Test-Path $fullPath) {
        Write-Host "Actualizando: $file"
        
        $content = Get-Content $fullPath -Raw
        
        # Reemplazar <div className="d-flex"> por <div>
        $content = $content -replace '<div className="d-flex">', '<div>'
        
        # Reemplazar <main className="flex-fill p-4"> por <main className="container-fluid p-4">
        $content = $content -replace '<main className="flex-fill p-4">', '<main className="container-fluid p-4">'
        
        # Guardar cambios
        Set-Content -Path $fullPath -Value $content -NoNewline
        
        Write-Host "✓ Actualizado: $file"
    } else {
        Write-Host "✗ No encontrado: $file"
    }
}

Write-Host "`n✅ Proceso completado!"
