"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, X } from "lucide-react"

interface MapAddressPickerProps {
  onAddressSelect: (address: {
    lat: number
    lng: number
    city: string
    district: string
    street: string
  }) => void
  onClose: () => void
}

export function MapAddressPicker({ onAddressSelect, onClose }: MapAddressPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [marker, setMarker] = useState<any>(null)
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingAddress, setLoadingAddress] = useState(false)

  useEffect(() => {
    // Dynamically load Leaflet CSS and JS
    const loadLeaflet = async () => {
      // Add Leaflet CSS
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link")
        link.id = "leaflet-css"
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
      }

      // Load Leaflet JS
      if (!(window as any).L) {
        await new Promise<void>((resolve) => {
          const script = document.createElement("script")
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          script.onload = () => resolve()
          document.body.appendChild(script)
        })
      }

      return (window as any).L
    }

    const initMap = async () => {
      try {
        const L = await loadLeaflet()

        // Get user's current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords
              setupMap(L, latitude, longitude)
            },
            () => {
              // Default to Riyadh if geolocation fails
              setupMap(L, 24.7136, 46.6753)
            },
          )
        } else {
          setupMap(L, 24.7136, 46.6753)
        }
      } catch (error) {
        console.error(" Error loading map:", error)
        setLoading(false)
      }
    }

    const setupMap = (L: any, lat: number, lng: number) => {
      if (!mapRef.current) return

      const mapInstance = L.map(mapRef.current).setView([lat, lng], 13)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(mapInstance)

      // Add custom marker icon
      const customIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })

      const markerInstance = L.marker([lat, lng], {
        icon: customIcon,
        draggable: true,
      }).addTo(mapInstance)

      markerInstance.on("dragend", () => {
        const pos = markerInstance.getLatLng()
        setPosition({ lat: pos.lat, lng: pos.lng })
      })

      mapInstance.on("click", (e: any) => {
        const { lat, lng } = e.latlng
        markerInstance.setLatLng([lat, lng])
        setPosition({ lat, lng })
      })

      setMap(mapInstance)
      setMarker(markerInstance)
      setPosition({ lat, lng })
      setLoading(false)
    }

    initMap()

    return () => {
      if (map) {
        map.remove()
      }
    }
  }, [])

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`,
      )
      const data = await response.json()

      return {
        city: data.address.city || data.address.town || data.address.village || "الرياض",
        district: data.address.suburb || data.address.neighbourhood || "",
        street: data.address.road || "",
      }
    } catch (error) {
      console.error(" Error reverse geocoding:", error)
      return {
        city: "الرياض",
        district: "",
        street: "",
      }
    }
  }

  const handleConfirmLocation = async () => {
    if (!position) return

    setLoadingAddress(true)
    const address = await reverseGeocode(position.lat, position.lng)
    setLoadingAddress(false)

    onAddressSelect({
      lat: position.lat,
      lng: position.lng,
      ...address,
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[600px] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <h2 className="text-xl font-semibold">حدد موقعك على الخريطة</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
              <div className="text-center space-y-2">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                <p className="text-sm text-muted-foreground">جاري تحميل الخريطة...</p>
              </div>
            </div>
          )}
          <div ref={mapRef} className="w-full h-full" />
        </div>

        <div className="p-4 border-t space-y-3">
          <p className="text-sm text-muted-foreground text-center">اضغط على الخريطة أو اسحب العلامة لتحديد موقعك</p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              إلغاء
            </Button>
            <Button className="flex-1" onClick={handleConfirmLocation} disabled={!position || loadingAddress}>
              {loadingAddress ? "جاري التحميل..." : "تأكيد الموقع"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
