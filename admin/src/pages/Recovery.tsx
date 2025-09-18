import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Users, 
  Camera, 
  Upload,
  Search,
  Filter,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Download,
  Home,
  DollarSign,
  Phone,
  MapPin,
  Calendar,
  AlertCircle
} from "lucide-react";

export default function Recovery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("victims");

  const victimRegistrations = [
    {
      id: "VR-001",
      name: "Ravi Kumar Sharma",
      phone: "+91 98765 43210",
      email: "ravi.sharma@email.com",
      address: "House No. 245, Yamuna Vihar, Delhi",
      familyMembers: 4,
      registrationDate: "2024-01-20",
      disasterType: "flood",
      status: "verified",
      injuries: "Minor cuts, no hospitalization required",
      evacuationCenter: "Relief Camp A-1",
      documentsSubmitted: ["ID Proof", "Address Proof", "Family Photo"],
      needsAssistance: ["Temporary Shelter", "Food", "Clothing"],
      claimStatus: "approved",
      claimAmount: 50000,
      damagePhotos: 8
    },
    {
      id: "VR-002",
      name: "Priya Devi",
      phone: "+91 87654 32109", 
      email: "priya.devi@email.com",
      address: "Flat 302, River View Apartments, Delhi",
      familyMembers: 3,
      registrationDate: "2024-01-19",
      disasterType: "flood",
      status: "pending-verification",
      injuries: "None",
      evacuationCenter: "Community Center B-2",
      documentsSubmitted: ["ID Proof", "Address Proof"],
      needsAssistance: ["Medical Care", "Food", "Clean Water"],
      claimStatus: "under-review",
      claimAmount: 35000,
      damagePhotos: 12
    },
    {
      id: "VR-003",
      name: "Mohammad Ali Khan",
      phone: "+91 76543 21098",
      email: "ali.khan@email.com", 
      address: "Shop No. 15, Market Complex, Old Delhi",
      familyMembers: 6,
      registrationDate: "2024-01-21",
      disasterType: "fire",
      status: "verified",
      injuries: "Smoke inhalation, under treatment",
      evacuationCenter: "Medical Relief Center",
      documentsSubmitted: ["Business License", "Property Papers", "Insurance Documents"],
      needsAssistance: ["Medical Treatment", "Business Recovery", "Temporary Shelter"],
      claimStatus: "processing",
      claimAmount: 250000,
      damagePhotos: 25
    }
  ];

  const damageReports = [
    {
      id: "DR-001",
      victimId: "VR-001",
      victimName: "Ravi Kumar Sharma",
      propertyType: "residential",
      damageType: "structural", 
      severity: "moderate",
      assessmentDate: "2024-01-20",
      assessor: "Engineering Team A",
      estimatedCost: 450000,
      insuranceClaim: 350000,
      photosCount: 15,
      status: "assessed",
      repairTimeframe: "2-3 months",
      priority: "medium"
    },
    {
      id: "DR-002",
      victimId: "VR-002",
      victimName: "Priya Devi",
      propertyType: "residential",
      damageType: "flooding",
      severity: "severe",
      assessmentDate: "2024-01-21",
      assessor: "Survey Team B",
      estimatedCost: 780000,
      insuranceClaim: 600000,
      photosCount: 22,
      status: "pending-approval",
      repairTimeframe: "4-6 months", 
      priority: "high"
    },
    {
      id: "DR-003",
      victimId: "VR-003",
      victimName: "Mohammad Ali Khan",
      propertyType: "commercial",
      damageType: "fire",
      severity: "total-loss",
      assessmentDate: "2024-01-21",
      assessor: "Fire Investigation Unit",
      estimatedCost: 1200000,
      insuranceClaim: 900000,
      photosCount: 35,
      status: "approved",
      repairTimeframe: "6-8 months",
      priority: "critical"
    }
  ];

  const claimProcessing = [
    {
      id: "CL-001",
      victimId: "VR-001",
      victimName: "Ravi Kumar Sharma",
      claimAmount: 50000,
      claimType: "Emergency Relief",
      submissionDate: "2024-01-20",
      reviewDate: "2024-01-21",
      approvalDate: "2024-01-21",
      disbursementDate: "2024-01-22",
      status: "disbursed",
      reviewedBy: "Relief Officer - Amit Singh",
      bankAccount: "****1234",
      transactionId: "TXN789012345",
      documents: ["Damage Assessment", "ID Verification", "Bank Details"]
    },
    {
      id: "CL-002", 
      victimId: "VR-002",
      victimName: "Priya Devi",
      claimAmount: 35000,
      claimType: "Temporary Assistance",
      submissionDate: "2024-01-19",
      reviewDate: "2024-01-20",
      approvalDate: null,
      disbursementDate: null,
      status: "under-review",
      reviewedBy: "Relief Officer - Dr. Priya Sharma",
      bankAccount: "****5678",
      transactionId: null,
      documents: ["Damage Photos", "Medical Certificate", "Income Proof"]
    },
    {
      id: "CL-003",
      victimId: "VR-003", 
      victimName: "Mohammad Ali Khan",
      claimAmount: 250000,
      claimType: "Business Recovery",
      submissionDate: "2024-01-21",
      reviewDate: null,
      approvalDate: null,
      disbursementDate: null,
      status: "documentation-pending",
      reviewedBy: "Business Recovery Team",
      bankAccount: "****9012",
      transactionId: null,
      documents: ["Fire Investigation Report", "Business License", "Tax Returns"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': case 'approved': case 'disbursed': case 'assessed':
        return 'bg-safe text-safe-foreground';
      case 'pending-verification': case 'under-review': case 'processing':
        return 'bg-warning text-warning-foreground';
      case 'documentation-pending': case 'pending-approval':
        return 'bg-primary text-primary-foreground';
      case 'rejected': case 'cancelled':
        return 'bg-danger text-danger-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'total-loss': case 'critical': return 'text-danger';
      case 'severe': case 'high': return 'text-warning';
      case 'moderate': case 'medium': return 'text-primary';
      case 'minor': case 'low': return 'text-safe';
      default: return 'text-muted-foreground';
    }
  };

  const filteredVictims = victimRegistrations.filter(victim => {
    const matchesSearch = searchTerm === '' || 
      victim.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      victim.phone.includes(searchTerm) ||
      victim.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || victim.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalVictims: victimRegistrations.length,
    verifiedVictims: victimRegistrations.filter(v => v.status === 'verified').length,
    totalClaims: claimProcessing.length,
    disbursedAmount: claimProcessing
      .filter(c => c.status === 'disbursed')
      .reduce((sum, c) => sum + c.claimAmount, 0),
    pendingReviews: claimProcessing.filter(c => c.status === 'under-review').length
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Post-Disaster Recovery</h1>
          <p className="text-muted-foreground">Victim registration, damage assessment, and insurance claim processing</p>
        </div>
        
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Registration
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Bulk Import
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalVictims}</p>
                <p className="text-sm text-muted-foreground">Total Victims</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-safe-light">
                <CheckCircle className="h-6 w-6 text-safe" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.verifiedVictims}</p>
                <p className="text-sm text-muted-foreground">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalClaims}</p>
                <p className="text-sm text-muted-foreground">Insurance Claims</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-safe-light">
                <DollarSign className="h-6 w-6 text-safe" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{(stats.disbursedAmount / 100000).toFixed(1)}L</p>
                <p className="text-sm text-muted-foreground">Disbursed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-warning-light">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pendingReviews}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="victims">Victim Registration</TabsTrigger>
          <TabsTrigger value="damage">Damage Assessment</TabsTrigger>
          <TabsTrigger value="claims">Insurance Claims</TabsTrigger>
        </TabsList>

        {/* Victims Tab */}
        <TabsContent value="victims" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name, phone, or address..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending-verification">Pending Verification</SelectItem>
                      <SelectItem value="under-review">Under Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Victim List */}
          <div className="grid gap-4">
            {filteredVictims.map((victim) => (
              <Card key={victim.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4 flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-xl">{victim.name}</h3>
                            <Badge variant="outline" className="text-xs">{victim.id}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(victim.status)} variant="secondary">
                              {victim.status.replace('-', ' ').toUpperCase()}
                            </Badge>
                            <Badge className={getStatusColor(victim.claimStatus)} variant="secondary">
                              Claim: {victim.claimStatus.replace('-', ' ').toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Personal Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Phone:</span>
                            <span>{victim.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Address:</span>
                            <span className="truncate">{victim.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Family Members:</span>
                            <span>{victim.familyMembers}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Registered:</span>
                            <span>{victim.registrationDate}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Disaster Type:</span>
                            <span className="capitalize">{victim.disasterType}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Home className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Evacuation Center:</span>
                            <span>{victim.evacuationCenter}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Claim Amount:</span>
                            <span>₹{victim.claimAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Camera className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Damage Photos:</span>
                            <span>{victim.damagePhotos} uploaded</span>
                          </div>
                        </div>
                      </div>

                      {/* Injuries */}
                      <div className="space-y-2">
                        <span className="font-medium text-sm">Injuries/Medical Status:</span>
                        <p className="text-sm bg-muted/50 p-2 rounded">{victim.injuries}</p>
                      </div>

                      {/* Documents & Assistance */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <span className="font-medium text-sm">Documents Submitted:</span>
                          <div className="flex flex-wrap gap-1">
                            {victim.documentsSubmitted.map((doc) => (
                              <Badge key={doc} variant="outline" className="text-xs">
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <span className="font-medium text-sm">Assistance Needed:</span>
                          <div className="flex flex-wrap gap-1">
                            {victim.needsAssistance.map((need) => (
                              <Badge key={need} variant="outline" className="text-xs border-warning text-warning">
                                {need}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:w-48">
                      {victim.status === 'pending-verification' && (
                        <Button size="sm" className="w-full">
                          <CheckCircle className="h-3 w-3 mr-2" />
                          Verify Registration
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="h-3 w-3 mr-2" />
                        View Documents
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <Camera className="h-3 w-3 mr-2" />
                        View Photos ({victim.damagePhotos})
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <FileText className="h-3 w-3 mr-2" />
                        Generate Report
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        Edit Registration
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Damage Assessment Tab */}
        <TabsContent value="damage" className="space-y-4">
          <div className="grid gap-4">
            {damageReports.map((report) => (
              <Card key={report.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4 flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-xl">{report.victimName}</h3>
                            <Badge variant="outline" className="text-xs">{report.id}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(report.status)} variant="secondary">
                              {report.status.replace('-', ' ').toUpperCase()}
                            </Badge>
                            <span className={`text-sm font-medium ${getSeverityColor(report.severity)}`}>
                              {report.severity.replace('-', ' ').toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Damage Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Home className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Property Type:</span>
                            <span className="capitalize">{report.propertyType}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Damage Type:</span>
                            <span className="capitalize">{report.damageType}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Assessment Date:</span>
                            <span>{report.assessmentDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Assessor:</span>
                            <span>{report.assessor}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Estimated Cost:</span>
                            <span>₹{report.estimatedCost.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Insurance Claim:</span>
                            <span>₹{report.insuranceClaim.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Camera className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Photos:</span>
                            <span>{report.photosCount} images</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Repair Time:</span>
                            <span>{report.repairTimeframe}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:w-48">
                      {report.status === 'pending-approval' && (
                        <>
                          <Button size="sm" className="w-full">
                            <CheckCircle className="h-3 w-3 mr-2" />
                            Approve Assessment
                          </Button>
                          <Button size="sm" variant="outline" className="w-full">
                            <XCircle className="h-3 w-3 mr-2" />
                            Request Revision
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="h-3 w-3 mr-2" />
                        View Photos ({report.photosCount})
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <Download className="h-3 w-3 mr-2" />
                        Download Report
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        Update Assessment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Claims Tab */}
        <TabsContent value="claims" className="space-y-4">
          <div className="grid gap-4">
            {claimProcessing.map((claim) => (
              <Card key={claim.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4 flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-xl">{claim.victimName}</h3>
                            <Badge variant="outline" className="text-xs">{claim.id}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(claim.status)} variant="secondary">
                              {claim.status.replace('-', ' ').toUpperCase()}
                            </Badge>
                            <span className="text-sm font-medium">
                              ₹{claim.claimAmount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Claim Timeline */}
                      <div className="space-y-3">
                        <span className="font-medium text-sm">Processing Timeline:</span>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-4 w-4 text-safe" />
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="text-sm">Submitted</span>
                                <span className="text-xs text-muted-foreground">{claim.submissionDate}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {claim.reviewDate ? (
                              <CheckCircle className="h-4 w-4 text-safe" />
                            ) : (
                              <Clock className="h-4 w-4 text-warning" />
                            )}
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="text-sm">Under Review</span>
                                <span className="text-xs text-muted-foreground">
                                  {claim.reviewDate || 'Pending'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {claim.approvalDate ? (
                              <CheckCircle className="h-4 w-4 text-safe" />
                            ) : (
                              <Clock className="h-4 w-4 text-muted-foreground" />
                            )}
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="text-sm">Approved</span>
                                <span className="text-xs text-muted-foreground">
                                  {claim.approvalDate || 'Pending'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {claim.disbursementDate ? (
                              <CheckCircle className="h-4 w-4 text-safe" />
                            ) : (
                              <Clock className="h-4 w-4 text-muted-foreground" />
                            )}
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="text-sm">Disbursed</span>
                                <span className="text-xs text-muted-foreground">
                                  {claim.disbursementDate || 'Pending'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Claim Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Claim Type:</span>
                            <span>{claim.claimType}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Reviewed By:</span>
                            <span>{claim.reviewedBy}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Bank Account:</span>
                            <span>{claim.bankAccount}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {claim.transactionId && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Transaction ID:</span>
                              <span className="font-mono text-xs">{claim.transactionId}</span>
                            </div>
                          )}
                          <div className="space-y-1">
                            <span className="font-medium text-sm">Required Documents:</span>
                            <div className="flex flex-wrap gap-1">
                              {claim.documents.map((doc) => (
                                <Badge key={doc} variant="outline" className="text-xs">
                                  {doc}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:w-48">
                      {claim.status === 'under-review' && (
                        <>
                          <Button size="sm" className="w-full">
                            <CheckCircle className="h-3 w-3 mr-2" />
                            Approve Claim
                          </Button>
                          <Button size="sm" variant="outline" className="w-full">
                            <XCircle className="h-3 w-3 mr-2" />
                            Request Documents
                          </Button>
                        </>
                      )}
                      {claim.status === 'approved' && !claim.disbursementDate && (
                        <Button size="sm" className="w-full">
                          <DollarSign className="h-3 w-3 mr-2" />
                          Process Payment
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="h-3 w-3 mr-2" />
                        View Documents
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <Download className="h-3 w-3 mr-2" />
                        Download Receipt
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        Update Status
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}