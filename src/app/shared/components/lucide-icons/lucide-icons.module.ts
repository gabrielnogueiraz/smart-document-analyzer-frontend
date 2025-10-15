import { NgModule } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  FileText,
  Copy,
  Check,
  Download,
  Sparkles,
  Plus,
  Search,
  Eye,
  Trash2,
  Upload,
  User,
  Mail,
  Lock,
  EyeOff,
  X,
  Key,
  HardDrive,
  CheckCircle,
  Save
} from 'lucide-angular';

const icons = {
  ArrowLeft,
  BarChart3,
  Calendar,
  FileText,
  Copy,
  Check,
  Download,
  Sparkles,
  Plus,
  Search,
  Eye,
  Trash2,
  Upload,
  User,
  Mail,
  Lock,
  EyeOff,
  X,
  Key,
  HardDrive,
  CheckCircle,
  Save
};

@NgModule({
  imports: [LucideAngularModule.pick(icons)],
  exports: [LucideAngularModule]
})
export class LucideIconsModule {}
