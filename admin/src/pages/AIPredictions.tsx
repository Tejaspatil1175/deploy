import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  TrendingUp, 
  TrendingDown,
  BarChart3, 
  AlertTriangle,
  MapPin,
  Clock,
  Zap,
  Eye,
  RefreshCw,
  Download,
  Settings,
  Activity
} from "lucide-react";

export default function AIPredictions() {
  const predictionModels = [
    {
      id: "MODEL-001",
      name: "Flood Risk Predictor",
      type: "flood",
      accuracy: 87.5,
      lastTrained: "2024-01-15",
      status: "active",
      predictions: 142,
      dataPoints: 50000
    },
    {
      id: "MODEL-002", 
      name: "Earthquake Impact Analyzer",
      type: "earthquake",
      accuracy: 92.3,
      lastTrained: "2024-01-10",
      status: "active", 
      predictions: 78,
      dataPoints: 35000
    },
    {
      id: "MODEL-003",
      name: "Fire Spread Simulator",
      type: "fire",
      accuracy: 84.2,
      lastTrained: "2024-01-18",
      status: "training",
      predictions: 203,
      dataPoints: 28000
    },
    {
      id: "MODEL-004",
      name: "Cyclone Path Predictor",
      type: "cyclone",
      accuracy: 89.7,
      lastTrained: "2024-01-12",
      status: "active",
      predictions: 95,
      dataPoints: 42000
    }
  ];

  const activePredictions = [
    {
      id: "PRED-001",
      modelName: "Flood Risk Predictor",
      disasterType: "flood",
      location: "Yamuna Basin, Delhi",
      coordinates: "28.6519, 77.2315",
      severity: "high",
      confidence: 87.5,
      timeFrame: "Next 24-48 hours",
      impactRadius: "15 km",
      estimatedCasualties: "500-800",
      economicImpact: "₹120-150 crores",
      affectedPopulation: 45000,
      generatedAt: "2024-01-20 11:30",
      validUntil: "2024-01-22 11:30",
      factors: [
        "Heavy rainfall forecast: 150mm",
        "Yamuna water level: 205.2m",
        "Soil saturation: 85%", 
        "Drainage capacity: Exceeded"
      ],
      recommendations: [
        "Immediate evacuation of Zone A-1, A-2",
        "Deploy NDRF teams to high-risk areas",
        "Activate emergency shelters",
        "Issue public warning broadcasts"
      ]
    },
    {
      id: "PRED-002",
      modelName: "Earthquake Impact Analyzer", 
      disasterType: "earthquake",
      location: "NCR Region",
      coordinates: "28.7041, 77.1025",
      severity: "medium",
      confidence: 72.3,
      timeFrame: "Next 7-14 days",
      impactRadius: "50 km",
      estimatedCasualties: "200-400",
      economicImpact: "₹80-120 crores",
      affectedPopulation: 150000,
      generatedAt: "2024-01-20 09:15",
      validUntil: "2024-01-27 09:15",
      factors: [
        "Seismic activity increase: 15%",
        "Tectonic stress buildup detected",
        "Historical pattern analysis",
        "Ground water level changes"
      ],
      recommendations: [
        "Conduct building safety inspections",
        "Review emergency response protocols",
        "Update evacuation route markers",
        "Prepare medical emergency supplies"
      ]
    },
    {
      id: "PRED-003",
      modelName: "Fire Spread Simulator",
      disasterType: "fire",
      location: "Industrial Area, Rohini",
      coordinates: "28.7041, 77.1025", 
      severity: "critical",
      confidence: 93.8,
      timeFrame: "Next 6-12 hours",
      impactRadius: "8 km",
      estimatedCasualties: "100-200",
      economicImpact: "₹200-300 crores",
      affectedPopulation: 25000,
      generatedAt: "2024-01-20 14:45",
      validUntil: "2024-01-21 02:45",
      factors: [
        "High temperature: 42°C",
        "Low humidity: 12%",
        "Wind speed: 25 kmph",
        "Combustible materials present"
      ],
      recommendations: [
        "Immediate fire department alert",
        "Evacuate 2km radius area",
        "Deploy firefighting aircraft",
        "Block industrial gas supplies"
      ]
    }
  ];

  const getModelStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-safe text-safe-foreground';
      case 'training': return 'bg-warning text-warning-foreground';
      case 'error': return 'bg-danger text-danger-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-danger text-danger-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      case 'low': return 'bg-safe text-safe-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getDisasterIcon = (type: string) => {
    switch (type) {
      case 'flood': return '🌊';
      case 'earthquake': return '🏗️';
      case 'fire': return '🔥';
      case 'cyclone': return '🌀';
      default: return '⚠️';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-safe';
    if (confidence >= 70) return 'text-primary';
    if (confidence >= 50) return 'text-warning';
    return 'text-danger';
  };

  const stats = {
    totalModels: predictionModels.length,
    activeModels: predictionModels.filter(m => m.status === 'active').length,
    activePredictions: activePredictions.length,
    avgAccuracy: Math.round(predictionModels.reduce((sum, m) => sum + m.accuracy, 0) / predictionModels.length)
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Damage Predictions</h1>
          <p className="text-muted-foreground">Machine learning models for disaster impact analysis and forecasting</p>
        </div>
        
        <div className="flex gap-2">
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retrain Models
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Model Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalModels}</p>
                <p className="text-sm text-muted-foreground">AI Models</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-safe-light">
                <Activity className="h-6 w-6 text-safe" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeModels}</p>
                <p className="text-sm text-muted-foreground">Active Models</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-warning-light">
                <TrendingUp className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activePredictions}</p>
                <p className="text-sm text-muted-foreground">Active Predictions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgAccuracy}%</p>
                <p className="text-sm text-muted-foreground">Avg Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="predictions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="predictions">Active Predictions</TabsTrigger>
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        {/* Active Predictions */}
        <TabsContent value="predictions" className="space-y-4">
          <div className="grid gap-4">
            {activePredictions.map((prediction) => (
              <Card key={prediction.id} className={`overflow-hidden ${prediction.severity === 'critical' ? 'ring-2 ring-danger/20' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4 flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{getDisasterIcon(prediction.disasterType)}</span>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-xl">{prediction.modelName}</h3>
                              <Badge variant="outline" className="text-xs">{prediction.id}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getSeverityColor(prediction.severity)} variant="secondary">
                                {prediction.severity.toUpperCase()}
                              </Badge>
                              <span className={`text-sm font-medium ${getConfidenceColor(prediction.confidence)}`}>
                                {prediction.confidence}% confidence
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Prediction Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Location:</span>
                            <span>{prediction.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Time Frame:</span>
                            <span>{prediction.timeFrame}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Impact Radius:</span>
                            <span>{prediction.impactRadius}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Affected Population:</span>
                            <span>{prediction.affectedPopulation.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Est. Casualties:</span>
                            <span className="text-warning">{prediction.estimatedCasualties}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Economic Impact:</span>
                            <span className="text-danger">{prediction.economicImpact}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Generated:</span>
                            <span className="text-muted-foreground">{prediction.generatedAt}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Valid Until:</span>
                            <span className="text-muted-foreground">{prediction.validUntil}</span>
                          </div>
                        </div>
                      </div>

                      {/* Contributing Factors */}
                      <div className="space-y-2">
                        <span className="font-medium text-sm">Contributing Factors:</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {prediction.factors.map((factor, index) => (
                            <div key={index} className="bg-muted/30 p-2 rounded text-xs">
                              • {factor}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AI Recommendations */}
                      <div className="space-y-2">
                        <span className="font-medium text-sm">AI Recommendations:</span>
                        <div className="space-y-1">
                          {prediction.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start gap-2 bg-primary/10 p-2 rounded text-xs">
                              <Zap className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:w-48">
                      <Button size="sm" className="w-full">
                        <Eye className="h-3 w-3 mr-2" />
                        View on Map
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <Download className="h-3 w-3 mr-2" />
                        Export Report
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <AlertTriangle className="h-3 w-3 mr-2" />
                        Create Alert
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        Update Factors
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* AI Models */}
        <TabsContent value="models" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {predictionModels.map((model) => (
              <Card key={model.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{getDisasterIcon(model.type)}</span>
                      {model.name}
                    </CardTitle>
                    <Badge className={getModelStatusColor(model.status)} variant="secondary">
                      {model.status.toUpperCase()}
                    </Badge>
                  </div>
                  <CardDescription>AI model for {model.type} disaster prediction</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Model Accuracy</span>
                      <span className="font-medium">{model.accuracy}%</span>
                    </div>
                    <Progress value={model.accuracy} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Predictions Made:</span>
                      <p className="text-muted-foreground">{model.predictions}</p>
                    </div>
                    <div>
                      <span className="font-medium">Data Points:</span>
                      <p className="text-muted-foreground">{model.dataPoints.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium">Last Trained:</span>
                      <p className="text-muted-foreground">{model.lastTrained}</p>
                    </div>
                    <div>
                      <span className="font-medium">Model ID:</span>
                      <p className="text-muted-foreground">{model.id}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <RefreshCw className="h-3 w-3 mr-2" />
                      Retrain
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="h-3 w-3 mr-2" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Performance Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-safe" />
                  Model Performance Trends
                </CardTitle>
                <CardDescription>Accuracy metrics over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Performance charts will be displayed here</p>
                    <p className="text-xs text-muted-foreground">Integration with analytics library needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Prediction Accuracy
                </CardTitle>
                <CardDescription>Real vs predicted outcomes comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Accuracy comparison charts will be displayed here</p>
                    <p className="text-xs text-muted-foreground">Historical data analysis visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Model Training Progress</CardTitle>
                <CardDescription>Current training status and data pipeline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Fire Spread Model</span>
                    <span className="font-medium">Training... 67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Data Ingestion</span>
                    <span className="font-medium">Active</span>
                  </div>
                  <Progress value={100} className="h-2 bg-safe" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Model Validation</span>
                    <span className="font-medium">Scheduled</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Resources</CardTitle>
                <CardDescription>AI processing and storage utilization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>GPU Utilization</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span className="font-medium">45.2GB / 64GB</span>
                  </div>
                  <Progress value={71} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Storage</span>
                    <span className="font-medium">2.4TB / 5TB</span>
                  </div>
                  <Progress value={48} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}