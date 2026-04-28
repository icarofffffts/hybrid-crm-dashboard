param (
    [switch]$DryRun
)

$VpsUser = "ubuntu"
$VpsIp = "54.197.0.250"
$SshKey = "C:\Users\Administrator\Downloads\arxsenhass.pem"
$VpsPath = "/var/www/hybrid-crm-dashboard"
$Pm2Name = "hybrid-crm-dashboard"
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupDir = "${VpsPath}/backups/build-${Timestamp}"

if ($DryRun) {
    Write-Host "[DRY RUN] Simulação de Deploy para Hybrid CRM Dashboard" -ForegroundColor Magenta
    Write-Host "Destino VPS: $VpsPath"
    Write-Host "Processo: Build Local -> Compactação (excluindo cache) -> Upload -> Extração no VPS"
    Write-Host "Nenhuma alteração real será feita." -ForegroundColor Yellow
    exit 0
}

Write-Host "--- Iniciando Deploy Otimizado: Hybrid CRM Dashboard ---" -ForegroundColor Cyan

# 1. Build Local
Write-Host "1/5. Executando build local (Next.js)..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro no build local!" -ForegroundColor Red
    exit 1
}
Write-Host "Build concluído." -ForegroundColor Green

# 2. Compactar Build (Excluindo cache e lixo de desenvolvimento)
Write-Host "2/5. Compactando arquivos para transferência (limpando build)..." -ForegroundColor Yellow
Remove-Item deploy_bundle.tar.gz -ErrorAction SilentlyContinue

# Itens essenciais para o servidor
$ItemsToPack = @(".next", "public", "package.json", "package-lock.json")
if (Test-Path "next.config.mjs") { $ItemsToPack += "next.config.mjs" }
if (Test-Path "next.config.ts") { $ItemsToPack += "next.config.ts" }

# Excluímos cache, tipos e arquivos de desenvolvimento (.next/dev) para reduzir o peso e evitar erros de permissão
tar --exclude='.next/cache' --exclude='.next/dev' --exclude='.next/types' -czf deploy_bundle.tar.gz $ItemsToPack
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro ao compactar arquivos!" -ForegroundColor Red
    exit 1
}
$BundleSize = (Get-Item deploy_bundle.tar.gz).Length / 1MB
Write-Host ("Pacote criado: {0:N2} MB" -f $BundleSize) -ForegroundColor Green

# 3. Upload e Preparação no VPS
Write-Host "3/5. Enviando pacote para o VPS..." -ForegroundColor Yellow
scp -i $SshKey deploy_bundle.tar.gz ${VpsUser}@${VpsIp}:${VpsPath}/
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro no upload!" -ForegroundColor Red
    exit 1
}

Write-Host "4/5. Preparando e extraindo novo build no VPS (Método Swap)..." -ForegroundColor Yellow
$RemoteCmd = @"
cd ${VpsPath}
# Garante que o processo não esteja travando arquivos
pm2 stop ${Pm2Name} 2>/dev/null || true

# Limpeza e Backup de segurança
rm -rf .next_old public_old
[ -d .next ] && mv .next .next_old
[ -d public ] && mv public public_old
rm -f package.json package-lock.json next.config.*

# Extração limpa
tar -xzf deploy_bundle.tar.gz
rm deploy_bundle.tar.gz

# Backup permanente
mkdir -p backups
cp -r .next_old backups/build-${Timestamp} 2>/dev/null || true
"@

ssh -i $SshKey ${VpsUser}@${VpsIp} $RemoteCmd
Write-Host "Arquivos extraídos no VPS." -ForegroundColor Green

# 4. Reiniciar via PM2
Write-Host "5/5. Reiniciando processo PM2: $Pm2Name..." -ForegroundColor Yellow
# Usamos start/restart explícito para garantir que pegue o novo package.json e dependências se necessário
# IMPORTANTE: Alterado para porta 3004 para bater com o Nginx no VPS
ssh -i $SshKey ${VpsUser}@${VpsIp} "cd ${VpsPath} && (pm2 restart $Pm2Name || pm2 start npm --name '$Pm2Name' -- start -- -p 3004)"



# 5. Limpeza Local
Remove-Item deploy_bundle.tar.gz -ErrorAction SilentlyContinue

Write-Host "--- Deploy Concluído com Sucesso! 🚀 ---" -ForegroundColor Cyan

