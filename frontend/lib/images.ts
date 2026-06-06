export function mapProductImage(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('moisturising cream') || n.includes('moisturizer') || n.includes('cream')) {
    if (n.includes('revitalift')) {
      return 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=400&auto=format&fit=crop&q=80'
    }
    return 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&auto=format&fit=crop&q=80'
  }
  if (n.includes('brufen') || n.includes('ibuprofen') || n.includes('tablet') || n.includes('panadol')) {
    return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80'
  }
  if (n.includes('glucose') || n.includes('glucometer') || n.includes('accu-chek') || n.includes('blood sugar') || n.includes('monitor kit')) {
    return '/images/glucometer.png'
  }
  if (n.includes('multivitamin') || n.includes('centrum') || n.includes('supplement') || n.includes('vitamin c') || n.includes('effervescent')) {
    if (n.includes('vitamin c')) {
      return 'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=400&auto=format&fit=crop&q=80'
    }
    if (n.includes('centrum silver') || n.includes('silver multivitamin')) {
      return 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=400&auto=format&fit=crop&q=80'
    }
    return 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&auto=format&fit=crop&q=80'
  }
  if (n.includes('neem') || n.includes('face wash') || n.includes('cleanser') || n.includes('cleanse')) {
    if (n.includes('himalaya')) {
      return 'https://images.unsplash.com/photo-1556229174-5e42a09e45af?w=400&auto=format&fit=crop&q=80'
    }
    return 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80'
  }
  if (n.includes('formula') || n.includes('aptamil') || n.includes('infant') || n.includes('baby') || n.includes('nappies')) {
    return 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&auto=format&fit=crop&q=80'
  }
  if (n.includes('blood pressure') || n.includes('bp monitor') || n.includes('hypertension') || n.includes('philips')) {
    return '/images/bp_monitor.png'
  }
  if (n.includes('omega') || n.includes('fish oil')) {
    return 'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=400&auto=format&fit=crop&q=80'
  }
  if (n.includes('thermometer')) {
    return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80'
  }
  // Default fallback image
  return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80'
}
