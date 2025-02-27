"use client"

import type React from "react"

import { useState } from "react"
import { Upload, ImageIcon, Car, AlertCircle, Loader2, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export default function ANPRDemo() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Check if file type is allowed
      if (!["image/jpeg", "image/png", "image/jpg"].includes(selectedFile.type)) {
        setError("Por favor sube una imagen válida (JPEG, JPG, o PNG)")
        return
      }

      setFile(selectedFile)
      setError(null)

      // Create preview
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]

    if (droppedFile) {
      if (!["image/jpeg", "image/png", "image/jpg"].includes(droppedFile.type)) {
        setError("Por favor sube una imagen válida (JPEG, JPG, o PNG)")
        return
      }

      setFile(droppedFile)
      setError(null)

      // Create preview
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(droppedFile)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Por favor selecciona una imagen para analizar")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // This is where you would connect to your backend
      // For now, we'll simulate a response after a delay
      setTimeout(() => {
        // Mock response data based on the provided JSON structure
        const mockResponse = {
          car: {
            make: "Toyota",
            model: "Corolla",
            color: "Plateado",
          },
          license_plate: {
            number: "ABC123",
            country: "México",
            region: "Ciudad de México",
          },
          environment: {
            location_type: "Calle",
            weather: "Soleado",
            time_of_day: "Día",
          },
          additional_info: {
            occupants_visible: "Sí",
            damage: "No visible",
          },
        }

        setResults(mockResponse)
        setIsLoading(false)
      }, 2000)

      // When connecting to a real backend, you would use code like this:
      /*
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }
      
      const data = await response.json();
      setResults(data);
      */
    } catch (err) {
      setError("Ocurrió un error al analizar la imagen. Por favor intenta de nuevo.")
      setIsLoading(false)
    }
  }

  // Reset the form
  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setResults(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <Car className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Sistema ANPR
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Sube una imagen de un vehículo para analizar su placa y detalles usando nuestro sistema de reconocimiento
            automático.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Upload Section */}
          <Card className="border-none shadow-lg overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-purple-600"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Subir Imagen</CardTitle>
              <CardDescription>Selecciona o arrastra una imagen del vehículo para analizar</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    preview
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5"
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  {preview ? (
                    <div className="space-y-4">
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-md">
                        <Image
                          src={preview || "/placeholder.svg"}
                          alt="Vista previa del vehículo"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Imagen cargada
                      </Badge>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <p className="mb-1 font-medium text-lg">Haz clic para subir o arrastra y suelta</p>
                      <p className="text-sm text-muted-foreground">JPG, JPEG, o PNG (máx. 10MB)</p>
                    </div>
                  )}
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/jpeg, image/png, image/jpg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <Alert variant="destructive" className="animate-in fade-in-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all"
                    disabled={!file || isLoading}
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analizando...
                      </>
                    ) : (
                      <>
                        <Car className="mr-2 h-5 w-5" />
                        Analizar Vehículo
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleReset} className="flex-1" size="lg">
                    Reiniciar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="border-none shadow-lg overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-purple-600 to-primary"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Resultados del Análisis</CardTitle>
              <CardDescription>
                {results ? "Información del vehículo y placa" : "Los resultados aparecerán aquí después del análisis"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative h-20 w-20">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-pulse"></div>
                    <Loader2 className="h-20 w-20 animate-spin text-primary" />
                  </div>
                  <p className="text-muted-foreground mt-6 text-lg">Analizando tu imagen...</p>
                </div>
              ) : results ? (
                <div className="space-y-6 animate-in fade-in-50">
                  {/* Car Information */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-3 flex items-center text-primary">
                      <Car className="h-5 w-5 mr-2" /> Detalles del Vehículo
                    </h3>
                    <Table>
                      <TableBody>
                        <TableRow className="hover:bg-white/50 dark:hover:bg-white/5">
                          <TableCell className="font-medium">Marca</TableCell>
                          <TableCell>{results.car.make}</TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-white/50 dark:hover:bg-white/5">
                          <TableCell className="font-medium">Modelo</TableCell>
                          <TableCell>{results.car.model}</TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-white/50 dark:hover:bg-white/5">
                          <TableCell className="font-medium">Color</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-4 w-4 rounded-full bg-gray-300 mr-2"></div>
                              {results.car.color}
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* License Plate Information */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-3 flex items-center text-purple-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <rect width="18" height="12" x="3" y="6" rx="2" />
                        <path d="M16 10a2 2 0 0 1 0 4" />
                        <path d="M8 10a2 2 0 1 0 0 4" />
                        <path d="M10 9v6" />
                      </svg>
                      Placa
                    </h3>
                    <Table>
                      <TableBody>
                        <TableRow className="hover:bg-white/50 dark:hover:bg-white/5">
                          <TableCell className="font-medium">Número</TableCell>
                          <TableCell>
                            <span className="inline-block bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 px-3 py-1 rounded-md font-mono font-bold">
                              {results.license_plate.number}
                            </span>
                          </TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-white/50 dark:hover:bg-white/5">
                          <TableCell className="font-medium">País</TableCell>
                          <TableCell>{results.license_plate.country}</TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-white/50 dark:hover:bg-white/5">
                          <TableCell className="font-medium">Región</TableCell>
                          <TableCell>{results.license_plate.region}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Environment Information */}
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-3 flex items-center text-indigo-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                      </svg>
                      Entorno
                    </h3>
                    <Table>
                      <TableBody>
                        <TableRow className="hover:bg-white/50 dark:hover:bg-white/5">
                          <TableCell className="font-medium">Tipo de Ubicación</TableCell>
                          <TableCell>{results.environment.location_type}</TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-white/50 dark:hover:bg-white/5">
                          <TableCell className="font-medium">Clima</TableCell>
                          <TableCell>{results.environment.weather}</TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-white/50 dark:hover:bg-white/5">
                          <TableCell className="font-medium">Hora del Día</TableCell>
                          <TableCell>{results.environment.time_of_day}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Additional Information */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-3 flex items-center text-blue-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                      Información Adicional
                    </h3>
                    <Table>
                      <TableBody>
                        <TableRow className="hover:bg-white/50 dark:hover:bg-white/5">
                          <TableCell className="font-medium">Ocupantes Visibles</TableCell>
                          <TableCell>{results.additional_info.occupants_visible}</TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-white/50 dark:hover:bg-white/5">
                          <TableCell className="font-medium">Daños</TableCell>
                          <TableCell>{results.additional_info.damage}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center mb-6">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                  <p className="text-muted-foreground text-lg">
                    Sube y analiza una imagen de un vehículo para ver los resultados aquí
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

